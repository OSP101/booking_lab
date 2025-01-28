export async function generateMetadata({ params }) {
    const { id } = params;
  
    return {
      title: `${id}: Booking`,
      description: 'Website for queuing for inspection work, produced by OSP101',
    };
  }

export default function BookingLayout({ children }) {
    return <section>{children}</section>
  }