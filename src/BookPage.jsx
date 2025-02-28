import React from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Single import for both hooks
import styled from 'styled-components';

const BookPage = () => {
  const navigate = useNavigate();
  const { extensionName } = useParams();

  const handleBookService = (serviceType) => {
    navigate(`/calendar/${extensionName}`, { 
      state: { 
        selectedService: serviceType,
        extensionName: extensionName
      }
    });
  };

  return (
    <PricingContainer>
      <PricingHeader>
        <PricingLabel>
          <PricingIcon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4263EB" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </PricingIcon>
          SELECT A SERVICE
        </PricingLabel>
        <PricingTitle>
          Transparent leveraging,
          <br />
          <TitleSpan>Cross-network sharing!</TitleSpan>
        </PricingTitle>
        <PricingSubtitle>
          Choose the plan that best suits your needs. If you require assistance with a custom project, we're here to help.
        </PricingSubtitle>
      </PricingHeader>

      <PricingCards>
        <PricingCard>
          <SpotsBadge>
            <SpotDot />
            2 Spots Left
          </SpotsBadge>
          <CardIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4263EB" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </CardIcon>
          <CardType>EMAIL</CardType>
          <CardDescription>
            Ideal to by-pass Linkedin email words limits. No response guaranteed.
          </CardDescription>
          <CardPrice>FREE <PriceSpan>/One email</PriceSpan></CardPrice>
          
          <FeaturesList>
            <Feature>
              <FeatureIcon color="#FF6B6B">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 8l4 4-4 4M3 12h18" />
                </svg>
              </FeatureIcon>
              Free
            </Feature>
            <Feature>
              <FeatureIcon>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 16a4 4 0 0 1-.88-7.903M15 16a4 4 0 0 0 .88-7.903" />
                  <path d="M3 12h18" />
                </svg>
              </FeatureIcon>
              Only email
            </Feature>
            <Feature>
              <FeatureIcon>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </FeatureIcon>
              No response guaranteed
            </Feature>
            <Feature>
              <FeatureIcon>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </FeatureIcon>
              Low priority
            </Feature>
          </FeaturesList>
            
          <CTAButton onClick={() => handleBookService("One email (150 words)")}>
            Get Started Today
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </CTAButton>
        </PricingCard>

        <PricingCard highlighted>
          <PopularTag>POPULAR</PopularTag>
          <CardIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4263EB" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8"/>
              <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
              <path d="M16 8V2h6l-6 6"/>
            </svg>
          </CardIcon>
          <CardType>15min meeting</CardType>
          <CardDescription>
            Suited for people seeking strategic advice, paired with the expertise of a senior banker.
          </CardDescription>
          <CardPrice>€30 <PriceSpan>/One-time</PriceSpan></CardPrice>
          
          <FeaturesList>
            <Feature>
              <FeatureIcon color="#FF6B6B">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 8l4 4-4 4M3 12h18" />
                </svg>
              </FeatureIcon>
              1:1 meeting video/call
            </Feature>
            <Feature>
              <FeatureIcon>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 16a4 4 0 0 1-.88-7.903M15 16a4 4 0 0 0 .88-7.903" />
                  <path d="M3 12h18" />
                </svg>
              </FeatureIcon>
              48 Hour Answer
            </Feature>
            <Feature>
              <FeatureIcon>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </FeatureIcon>
              High priority
            </Feature>
          </FeaturesList>

          <AddOnOption>
            <AddOnIcon>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4263EB" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </AddOnIcon>
            Call summarize tools for +€10
            <AddButton>+ Add</AddButton>
          </AddOnOption>

          <CTAButton onClick={() => handleBookService("15min meeting")}>
            Get Started Today
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </CTAButton>
        </PricingCard>

        <PricingCard>
          <CardIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4263EB" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </CardIcon>
          <CardType>MENTORING</CardType>
          <CardSubtitle>
            Unique opportunity to learn from a mentor experience <span>to take your objectives to the skies!</span>
          </CardSubtitle>
          <CardPrice>€150 <PriceSpan>/month</PriceSpan></CardPrice>
          
          <FeaturesList>
            <Feature>
              <FeatureIcon color="#FF6B6B">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 8l4 4-4 4M3 12h18" />
                </svg>
              </FeatureIcon>
              1:1 meeting video/call
            </Feature>
            <Feature>
              <FeatureIcon>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 16a4 4 0 0 1-.88-7.903M15 16a4 4 0 0 0 .88-7.903" />
                  <path d="M3 12h18" />
                </svg>
              </FeatureIcon>
              48 Hour Answer
            </Feature>
            <Feature>
              <FeatureIcon>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </FeatureIcon>
              High priority
            </Feature>
          </FeaturesList>
            
          <QuoteButton onClick={() => handleBookService("Mentoring")}>
            Get Started today!
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </QuoteButton>
        </PricingCard>
      </PricingCards>
    </PricingContainer>
  );
};

// Styled Components optimized for 1300x750 display
const PricingContainer = styled.div`
  position: relative;
  width: 980px;
  margin: 0 auto;
  padding: 20px 0 30px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #333;
  z-index: 5;
`;

const PricingHeader = styled.div`
  text-align: center;
  margin-bottom: 25px;
  position: relative;
`;

const PricingLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #4263EB;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 10px;
`;

const PricingIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PricingTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #000;
  line-height: 1.2;
`;

const TitleSpan = styled.span`
  color: #6B7280;
  font-weight: 600;
`;

const PricingSubtitle = styled.p`
  max-width: 500px;
  margin: 0 auto;
  font-size: 14px;
  line-height: 1.4;
  color: #6B7280;
`;

const PricingCards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  position: relative;
`;

const PricingCard = styled.div`
  position: relative;
  background: white;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: ${props => props.highlighted ? 
    '0 8px 20px rgba(66, 99, 235, 0.12)' : 
    '0 4px 15px rgba(0, 0, 0, 0.05)'};
  border: 1px solid ${props => props.highlighted ? 
    'rgba(66, 99, 235, 0.2)' : 
    '#e5e7eb'};
  transition: all 0.3s ease;
  min-height: 450px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }
`;

const PopularTag = styled.div`
  position: absolute;
  top: -8px;
  right: 20px;
  background: #4263EB;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 99px;
  letter-spacing: 0.5px;
  z-index: 10;
  box-shadow: 0 0 10px rgba(66, 99, 235, 0.4);
`;

const SpotsBadge = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #10B981;
  font-size: 11px;
  font-weight: 500;
  z-index: 10;
`;

const SpotDot = styled.div`
  width: 5px;
  height: 5px;
  background-color: #10B981;
  border-radius: 50%;
`;

const CardIcon = styled.div`
  margin-bottom: 12px;
  position: relative;
  z-index: 5;
`;

const CardType = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #4263EB;
  margin-bottom: 8px;
  text-transform: uppercase;
  position: relative;
  z-index: 5;
`;

const CardDescription = styled.p`
  font-size: 13px;
  line-height: 1.4;
  color: #6B7280;
  margin-bottom: 16px;
  min-height: 55px;
  position: relative;
  z-index: 5;
`;

const CardSubtitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 16px;
  min-height: 55px;
  position: relative;
  z-index: 5;
  color: #333;
  
  span {
    color: #6B7280;
    font-weight: 500;
    display: block;
  }
`;

const CardPrice = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #000;
  margin-bottom: 16px;
  position: relative;
  z-index: 5;
`;

const PriceSpan = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  flex-grow: 1;
  position: relative;
  z-index: 5;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4B5563;
`;

const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || '#4263EB'};
`;

const AddOnOption = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #4B5563;
  background: rgba(240, 242, 245, 0.8);
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 14px;
  position: relative;
  z-index: 5;
  border: 1px solid rgba(220, 225, 235, 0.5);
`;

const AddOnIcon = styled.div`
  display: flex;
  align-items: center;
`;

const AddButton = styled.button`
  margin-left: auto;
  background: rgba(240, 245, 250, 0.8);
  border: 1px solid rgba(200, 210, 230, 0.5);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 500;
  color: #4263EB;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(230, 235, 255, 0.9);
    color: #3451C9;
    border-color: rgba(160, 180, 240, 0.7);
  }
`;

const CTAButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  position: relative;
  z-index: 5;
  background: linear-gradient(135deg, #4263EB 0%, #7B42EB 100%);
  color: white;
  font-size: 14px;
  font-weight: 600;
  padding: 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(66, 99, 235, 0.3);

  &:hover {
    background: linear-gradient(135deg, #3451C9 0%, #6A35D8 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(66, 99, 235, 0.4);
  }
`;

const QuoteButton = styled(CTAButton)`
  /* Inherits all styles from CTAButton */
`;

export default BookPage;