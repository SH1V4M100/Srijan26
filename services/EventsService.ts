"use server";

import { prisma } from "@/prisma/client";
import { SessionUser } from "@/types/user";
import { Event, RegistrationStatus, Team } from "@/types/events";
import ShortUniqueId from "short-unique-id";

const getRegistrationStatus = async (userId: string, event: Event) => {
    try {
        const team = await prisma.team.findFirst({
            where: {
                eventSlug: event.slug,
                memberIds: {
                    has: userId,
                },
            },
            select: {
                id: true,
                members: true,
                pendingMembers: true,
                name: true,
                leader: true,
                eventSlug: true,
                joiningCode: true,
            },
        });
        if (team)
            return {
                status: RegistrationStatus.REGISTERED,
                team,
                pendingTeamData: null,
            };

        const pendingTeam = await prisma.team.findFirst({
            where: {
                eventSlug: event.slug,
                pendingMemberIds: {
                    has: userId,
                },
            },
            select: {
                id: true,
                members: true,
                name: true,
                leader: true,
            },
        });

        const pendingTeamLeader = pendingTeam?.members.find(
            (member) => member.id === pendingTeam.leader,
        );

        if (!pendingTeam || !pendingTeamLeader)
            return {
                status: RegistrationStatus.NOT_REGISTERED,
                team: null,
                pendingTeamData: null,
            };

        const pendingTeamData = {
            id: pendingTeam.id,
            name: pendingTeam.name,
            leader: {
                name: pendingTeamLeader.name,
                email: pendingTeamLeader.email,
            },
        };

        return {
            status: RegistrationStatus.PENDING,
            team: null,
            pendingTeamData,
        };
    } catch (err) {
        console.error(`Error while fetching registration status: ${err}`);
        return {
            status: RegistrationStatus.NOT_REGISTERED,
            team: null,
            pendingTeamData: null,
        };
    }
};

const getEventFromSlug = async (slug: string) => {
    const event = await prisma.event.findFirst({
        where: {
            slug,
        },
    });
    return event;
};

const createTeam = async (
    event: Event,
    user: SessionUser,
    teamName: string,
) => {
    try {
        if (!event) return { ok: false, message: "Invalid event" };
        const existingTeam = await prisma.team.findFirst({
            where: {
                eventSlug: event.slug,
                name: teamName,
            },
        });
        if (existingTeam)
            return { ok: false, message: "Team name already taken" };
        const shortUid = new ShortUniqueId({ length: 6 }).rnd();
        const joiningCode = `${event.slug}_${shortUid}`;

        await prisma.team.create({
            data: {
                name: teamName,
                joiningCode,
                leader: user.id,
                eventSlug: event.slug,
                members: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        });

        return { ok: true, message: "Team created successfully" };
    } catch (err) {
        console.error(`Error while creating team: ${err}`);
        return { ok: false, message: "Error occurred - failed to create team" };
    }
};

const joinTeam = async (event: Event, user: SessionUser, teamCode: string) => {
    // TODO: send notification to team lead
    try {
        const team = await prisma.team.findUnique({
            where: {
                joiningCode: teamCode,
                eventSlug: event.slug,
            },
            select: {
                id: true,
                name: true,
                memberIds: true,
                pendingMemberIds: true,
            },
        });
        if (!team) return { ok: false, message: "Invalid joining code" };
        if (team.memberIds.length >= event.maxMembers)
            return { ok: false, message: "Team full" };

        await prisma.team.update({
            where: {
                joiningCode: teamCode,
            },
            data: {
                pendingMembers: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        });

        return { ok: true, message: `Joined team ${team.name}` };
    } catch (err) {
        console.error(`Error while joining team: ${err}`);
        return { ok: false, message: "Error occurred" };
    }
};

const transferTeamLead = async (teamId: string, newLeadId: string) => {
    try {
        const currentTeam = await prisma.team.findFirst({
            where: { id: teamId },
            select: { memberIds: true },
        });

        if (!currentTeam) {
            return { ok: false, message: "Team not found" };
        }

        if (!currentTeam.memberIds.includes(newLeadId)) {
            return { ok: false, message: "Member is no longer in team" };
        }

        await prisma.team.update({
            where: {
                id: teamId,
            },
            data: {
                leader: newLeadId,
            },
        });
        return { ok: true, message: "Changed team lead successfully!" };
    } catch (err) {
        console.log(`Error while transferring team lead: ${err}`);
        return { ok: false, message: "Error occurred" };
    }
};

const removeMember = async (teamId: string, memberId: string) => {
    try {
        await prisma.team.update({
            where: {
                id: teamId,
            },
            data: {
                members: {
                    disconnect: {
                        id: memberId,
                    },
                },
            },
        });
        return { ok: true, message: "Removed member" };
    } catch (err) {
        console.log(`Error while removing member: ${err}`);
        return { ok: false, message: "Error occurred" };
    }
};

const acceptPendingMember = async (
    teamId: string,
    memberId: string,
    event: Event,
) => {
    try {
        const status = await prisma.$transaction(async (txn) => {
            const team = await txn.team.findUnique({
                where: {
                    id: teamId,
                },
                select: {
                    memberIds: true,
                    pendingMemberIds: true
                },
            });

            if (!team) return { ok: false, message: "Invalid team" };

            if(!team.pendingMemberIds.includes(memberId)) return {ok: false, message: "Invalid invitation"};
            
            const teamSize = team?.memberIds.length;
            if (teamSize >= event.maxMembers)
                return { ok: false, message: "Team is full" };

            const existingTeam = await txn.team.findMany({
                where: {
                    eventSlug: event.slug,
                    memberIds: {
                        has: memberId,
                    },
                },
            });

            if (existingTeam && existingTeam.length > 0)
                return {
                    ok: false,
                    message: "Member is already in a team for given event",
                };

            await txn.team.update({
                where: {
                    id: teamId,
                },
                data: {
                    members: {
                        connect: {
                            id: memberId,
                        },
                    },
                    pendingMembers: {
                        disconnect: {
                            id: memberId,
                        },
                    },
                },
            });
        });
        if (status && !status.ok) return status;
        return { ok: true, message: "Accepted member" };
    } catch (err) {
        console.log(`Error while accepting member: ${err}`);
        return {
            ok: false,
            message: "Error occurred - failed to accept member",
        };
    }
};

const rejectPendingMember = async (teamId: string, memberId: string) => {
    try {
        await prisma.team.update({
            where: {
                id: teamId,
            },
            data: {
                pendingMembers: {
                    disconnect: {
                        id: memberId,
                    },
                },
            },
        });
        return { ok: true, message: "Rejected member" };
    } catch (err) {
        console.log(`Error while removing member: ${err}`);
        return { ok: false, message: "Error occurred - failed to reject" };
    }
};

const deleteTeam = async (team: Team) => {
    try {
        const oid = { $oid: team.id };

        await prisma.$transaction(async (txn) => {
            await txn.$runCommandRaw({
                update: "user",
                updates: [
                    {
                        q: {
                            $or: [{ teamIds: oid }, { pendingTeamIds: oid }],
                        },
                        u: {
                            $pull: {
                                teamIds: oid,
                                pendingTeamIds: oid,
                            },
                        },
                        multi: true,
                    },
                ],
                ordered: false,
            });

            await txn.team.delete({
                where: {
                    id: team.id,
                },
            });
        });

        return { ok: true, message: "Team deleted successfully" };
    } catch (err) {
        console.error(`Error while deleting team: ${err}`);
        return { ok: false, message: "Error occurred" };
    }
};

const leaveTeam = async (teamId: string, id: string) => {
    try {
        await prisma.team.update({
            where: {
                id: teamId,
            },
            data: {
                members: {
                    disconnect: {
                        id,
                    },
                },
            },
        });
        return { ok: true, message: "Left team successfully" };
    } catch (err) {
        console.error(`Error while leaving team: ${err}`);
        return { ok: false, message: "Error occurred" };
    }
};

const leavePendingTeam = async (teamId: string, id: string) => {
    try {
        await prisma.team.update({
            where: {
                id: teamId,
            },
            data: {
                pendingMembers: {
                    disconnect: {
                        id,
                    },
                },
            },
        });

        return { ok: true, message: "Left team successfully" };
    } catch (err) {
        console.error(`Error while leaving team: ${err}`);
        return { ok: false, message: "Error occurred" };
    }
};

export {
    getRegistrationStatus,
    getEventFromSlug,
    createTeam,
    joinTeam,
    transferTeamLead,
    removeMember,
    deleteTeam,
    leaveTeam,
    leavePendingTeam,
    acceptPendingMember,
    rejectPendingMember,
};
