import React from 'react';
import { useRouter } from 'next/router';
import { featuredEvents } from '../../data/eventsData';
import Layout from '../../components/Layout';
import TicketDetail from '../../components/TicketDetailModal';

const TicketPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const event = featuredEvents.find(e => e.id.toString() === id);

  if (!event) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Event not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <TicketDetail event={event} />
    </Layout>
  );
};

export default TicketPage;