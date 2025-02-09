export async function generateMetadata({ params }) {
  const { id } = params;

  return {
    title: `${id}: Booking`,
    description: 'Website for queuing for inspection work, produced by OSP101',

  };
}
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function BookingLayout({ children }) {
  return <section>{children}</section>
}