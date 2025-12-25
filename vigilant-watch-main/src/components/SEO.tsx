import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
}

export const SEO = ({ 
  title = 'FraudShield - Banking Transaction Fraud Detection Dashboard',
  description = 'Real-time fraud monitoring dashboard for risk analysts and security teams. Monitor suspicious transactions, analyze fraud patterns, and protect your banking operations.'
}: SEOProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
};
