
import { notFound } from "next/navigation";
import BookingConfirmation from "@/components/events/BookingConfirmation";

const events: Record<
  string,
  {
    title: string;
    date: string;
    venue: string;
  }
> = {
  "1": {
    title: "The IFE Fashion Showcase",
    date: "Date to be announced",
    venue: "Venue to be announced",
  },
  "2": {
    title: "Live Beyond",
    date: "Date to be announced",
    venue: "Venue to be announced",
  },
  "3": {
    title: "Excellence Awards",
    date: "Date to be announced",
    venue: "Venue to be announced",
  },
  "4": {
    title: "Runway Stories",
    date: "Date to be announced",
    venue: "Venue to be announced",
  },
  "5": {
    title: "The Grand Celebration",
    date: "Date to be announced",
    venue: "Venue to be announced",
  },
  "6": {
    title: "Creative Icons",
    date: "Date to be announced",
    venue: "Venue to be announced",
  },
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookingConfirmationPage({
  params,
}: PageProps) {
  const { id } = await params;
  const event = events[id];

  if (!event) {
    notFound();
  }

  return (
    <BookingConfirmation
      eventId={id}
      eventTitle={event.title}
      eventDate={event.date}
      venue={event.venue}
    />
  );
}
