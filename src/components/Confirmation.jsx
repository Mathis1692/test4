import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Check, ExternalLink } from 'lucide-react';
import styled from 'styled-components';

const Confirmation = () => {
  const location = useLocation();
  const bookingData = location.state;

  // Format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Format the time range
  const formatTimeRange = (time) => {
    // This is a simplified example. You might want to calculate the end time based on duration
    const startTime = time;
    const duration = 30; // minutes
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes);
    const endDate = new Date(startDate.getTime() + duration * 60000);
    
    return `${startTime} - ${endDate.getHours()}:${String(endDate.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <Container>
      <Card>
        {/* Success Icon */}
        <SuccessIconWrapper>
          <SuccessIcon>
            <Check size={24} color="white" />
          </SuccessIcon>
        </SuccessIconWrapper>

        {/* Success Message */}
        <Title>This meeting is scheduled</Title>
        <Subtitle>
          We sent an email with a calendar invitation
          with the details to everyone.
        </Subtitle>

        {/* Meeting Details */}
        <Section>
          <SectionTitle>Details</SectionTitle>
          <DetailText>
            {bookingData?.duration || '30min'} meeting between Zoey Lang and {bookingData?.name}
          </DetailText>
        </Section>

        <Section>
          <SectionTitle>When</SectionTitle>
          <DetailText>
            {formatDate(bookingData?.date)}
          </DetailText>
          <DetailText>
            {formatTimeRange(bookingData?.time)} (Argentina Standard Time)
          </DetailText>
        </Section>

        <Section>
          <SectionTitle>Invited</SectionTitle>
          <InviteeList>
            <Invitee>
              Zoey Lang ({bookingData?.email})
              <HostBadge>Host</HostBadge>
            </Invitee>
            <Invitee>
              {bookingData?.name} ({bookingData?.email})
            </Invitee>
          </InviteeList>
        </Section>

        <Section>
          <SectionTitle>Where</SectionTitle>
          <LocationLink href="#">
            Zoom <ExternalLink size={14} />
          </LocationLink>
        </Section>

        {bookingData?.notes && (
          <Section>
            <SectionTitle>Additional notes</SectionTitle>
            <DetailText>{bookingData.notes}</DetailText>
          </Section>
        )}

        {/* Rescheduling Options */}
        <RescheduleSection>
          Need to make a change?{' '}
          <ActionLink href="#">Reschedule</ActionLink>
          {' '}or{' '}
          <ActionLink href="#">Cancel</ActionLink>
        </RescheduleSection>

        {/* Calendar Integration */}
        <CalendarSection>
          <CalendarTitle>Add to calendar</CalendarTitle>
          <CalendarButtons>
            <CalendarButton>
              <img src="/api/placeholder/20/20" alt="Google Calendar" />
            </CalendarButton>
            <CalendarButton>
              <img src="/api/placeholder/20/20" alt="Outlook" />
            </CalendarButton>
            <CalendarButton>
              <img src="/api/placeholder/20/20" alt="Office 365" />
            </CalendarButton>
            <CalendarButton>
              <img src="/api/placeholder/20/20" alt="iCal" />
            </CalendarButton>
          </CalendarButtons>
        </CalendarSection>
      </Card>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f9fafb;
`;

const Card = styled.div`
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const SuccessIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const SuccessIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: #10B981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6B7280;
  text-align: center;
  margin-bottom: 32px;
`;

const Section = styled.div`
  padding: 24px 0;
  border-top: 1px solid #E5E7EB;

  &:first-of-type {
    border-top: none;
    padding-top: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
`;

const DetailText = styled.p`
  font-size: 14px;
  color: #4B5563;
  line-height: 1.5;
`;

const InviteeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Invitee = styled.div`
  font-size: 14px;
  color: #4B5563;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HostBadge = styled.span`
  background-color: #E5E7EB;
  color: #4B5563;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 9999px;
`;

const LocationLink = styled.a`
  color: #4263EB;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const RescheduleSection = styled.div`
  text-align: center;
  color: #6B7280;
  font-size: 14px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #E5E7EB;
`;

const ActionLink = styled.a`
  color: #4263EB;
  text-decoration: underline;
  font-weight: 500;

  &:hover {
    color: #3451C9;
  }
`;

const CalendarSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #E5E7EB;
`;

const CalendarTitle = styled.h3`
  font-size: 14px;
  color: #6B7280;
  text-align: center;
  margin-bottom: 16px;
`;

const CalendarButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const CalendarButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #F9FAFB;
    border-color: #D1D5DB;
  }

  img {
    width: 20px;
    height: 20px;
  }
`;

export default Confirmation;