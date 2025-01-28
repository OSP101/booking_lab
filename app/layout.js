import "./globals.css";
import { Inter } from 'next/font/google'
import Provider from './provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    template: '%s | Booking Lab',
    default: 'Booking Lab',
  },
  description: 'Website for queuing for inspection work, produced by OSP101',
}

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        <Provider children={children} session={session} />
      </body>
    </html>
  );
}
