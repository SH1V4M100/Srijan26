## How to use the PaymentSection.tsx?

- WHY? -> works on hooks/usePayments.ts (needs a bit of working)
- WHAT IT DOES -> modular section to allow merchandise, workshops and select event payments.

## Some snippets to work on:

- merchandise page:

```
import Image from 'next/image';
import { PaymentSection } from '@/components/PaymentSection';

export default function Merchandise() {
  return (
    <section className="text-gray-600 body-font overflow-hidden" style={{
      backgroundImage: 'url(/background.png)',
      backgroundSize: 'auto 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'left',
    }}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gradient-to-br backdrop-blur-lg border border-white/20 rounded-2xl p-1 max-w-5xl mx-4 my-10">
          <h1 className="text-4xl text-[#c085fd] mt-8 justify-center font-bold text-center">
            Srijan&apos;26 Merchandise
          </h1>
          
          <div className="container px-5 py-8 mx-auto">
            <div className="lg:w-4/5 mx-auto flex flex-wrap">
              <Image
                width={500}
                height={500}
                alt="Srijan 26 Official T-Shirt"
                className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                src="/shirt.png"
              />
              
              <PaymentSection
                title="Get the official Srijan 26 Merchandise"
                subtitle="T-SHIRT"
                price={359}
                imageSrc="/shirt.png"
                createOrderApi="/api/create-merch-order"
                verifyOrderApi="/api/verify-merch-payment"
                createOrderPayload={{ amount: 359, merchandise: "SHIRT" }}
                requiresSize={true}
                termsLink="/merch-terms-and-conditions.pdf"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- Workshop pages

```
// app/workshops/[slug]/page.tsx
import Image from 'next/image';
import { PaymentSection } from '@/components/PaymentSection';

export default function WorkshopPage({ params }: { params: { slug: string } }) {
  const workshop = { /* fetch workshop data */ };
  
  return (
    <section /* same styling */>
      <Image src={workshop.image} /* ... */ />
      <PaymentSection
        title={`Workshop: ${workshop.name}`}
        subtitle="WORKSHOP"
        price={workshop.price}
        imageSrc={workshop.image}
        createOrderApi="/api/create-workshop-order"
        verifyOrderApi="/api/verify-workshop-payment"
        createOrderPayload={{ amount: workshop.price, workshopSlug: params.slug }}
        requiresSize={false}
      />
    </section>
  );
}
```