import {
    EventCategory,
    EventFormType,
    EventPageData,
} from "@/types/events";

const eventCategories = [
    "CODING",
    "CIRCUITS_AND_ROBOTICS",
    "BUSINESS",
    "BRAINSTORMING",
    "GAMING",
    "MISCELLANEOUS",
];

function validateCategory(
    str: unknown,
): boolean | string {
    if (!str || typeof str !== "string") return false;
    if (eventCategories.includes(str)) return true;

    return "Invalid Event Category";
}

function transformCategory(str: string) {
    return str.toUpperCase();
}

function formToEvent(formData: EventFormType): EventPageData {
    const data: EventPageData = {
        name: formData.name,
        slug: formData.slug,
        minMembers: parseInt(formData.minMembers),
        maxMembers: parseInt(formData.maxMembers),
        registrationDeadline: new Date(formData.registrationDeadline),
        eventListingData: {
            description: formData.description,
            category: formData.category,
            format: formData.format,
            rules: formData.rules.map((rule) => rule.value),
            dates: formData.eventDates.map((date) => date.value),
            prizePool: formData.prizePool,
            prizes: formData.prizes.map((prize) => prize.value),
            coordinators: formData.coordinators.map(
                (coordinator) => coordinator.value,
            ),
            driveLink: formData.driveLink,
            poster: `/posters/${formData.slug}.webp`,
            tags: formData.tags.map((tag) => tag.value),
            registrationLink: formData.registrationLink,
        },
    };
    return data;
}

function eventToForm(eventData: EventPageData): EventFormType {
    const { eventListingData, name, slug, minMembers, maxMembers, registrationDeadline } = eventData;
    const {
        description = "",
        category,
        format = "",
        driveLink = "",
        prizePool = "",
        registrationLink = "",
        dates = [],
        rules = [],
        prizes = [],
        coordinators = [],
        tags = []
    } = eventListingData ?? {};

    const mapToValue = (arr: string[]) => arr.map((value) => ({ value }));

    const data: EventFormType = {
        name,
        slug,
        description,
        category: category as EventCategory,
        minMembers: String(minMembers),
        maxMembers: String(maxMembers),
        format,
        driveLink,
        eventDates: mapToValue(dates),
        rules: mapToValue(rules),
        prizes: mapToValue(prizes),
        coordinators: mapToValue(coordinators),
        registrationDeadline: registrationDeadline.toDateString(),
        prizePool,
        tags: mapToValue(tags),
        registrationLink
    };
    return data;
}

const getDefaultData = (slug: string | undefined): EventFormType => {
    return {
        name: "",
        slug: slug ?? "",
        description: "",
        format: "",
        rules: [{ value: "" }],
        category: "",
        prizes: [{ value: "" }],
        registrationDeadline: "",
        eventDates: [{ value: "" }],
        coordinators: [{ value: "" }],
        minMembers: "",
        maxMembers: "",
        prizePool: "",
        tags: [{ value: "" }],
        registrationLink: "",
        driveLink: "",
    };
};

export {
    validateCategory,
    transformCategory,
    formToEvent,
    eventToForm,
    getDefaultData,
};
