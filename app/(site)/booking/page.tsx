import { redirect } from "next/navigation";

// Booking page removed — redirect to contacts
export default function BookingRedirect() {
  redirect("/contacts");
}
