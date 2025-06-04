import { useRouteLoaderData } from "react-router-dom";
import EventForm from "../components/EventForm";

function EditEventPage() {
  const data = useRouteLoaderData("event-detail");

  if (!data || !data.event) {
    return <p>Event not found.</p>;
  }

  return <EventForm method="patch" event={data.event} />;
}

export default EditEventPage;
