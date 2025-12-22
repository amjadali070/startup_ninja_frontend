import React from "react";
import { useParams, Navigate } from "react-router-dom";
import ProductsMain from "../../components/landing-page/products/ProductsMain";
import SolutionsMain from "../../components/landing-page/solutions/SolutionsMain";
// import DevelopersMain from '../../components/landing-page/developers/DevelopersMain';
import ResourcesMain from "../../components/landing-page/resources/ResourcesMain";
import PricingMain from "../../components/landing-page/pricing/PricingMain";
import BookDemoMain from "../../components/landing-page/book-demo/BookDemoMain";
import ContactMain from "../../components/landing-page/contact/ContactMain";
import DocumentationMain from "../../components/landing-page/documentation/DocumentationMain";
import TermsMain from "../../components/landing-page/terms/TermsMain";
import LatestNewsMain from "../../components/landing-page/latest-news/LatestNewsMain";
import BusinessMain from "../../components/landing-page/business/BusinessMain";

const pageComponents: Record<string, React.ComponentType> = {
  products: ProductsMain,
  solutions: SolutionsMain,
  // 'developers': DevelopersMain,
  resources: ResourcesMain,
  pricing: PricingMain,
  "book-demo": BookDemoMain,
  contact: ContactMain,
  documentation: DocumentationMain,
  terms: TermsMain,
  "latest-news": LatestNewsMain,
  business: BusinessMain,
};

const LandingPage: React.FC = () => {
  const { page } = useParams<{ page: string }>();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (!page || !pageComponents[page]) {
    return <Navigate to="/" replace />;
  }

  const PageComponent = pageComponents[page];

  return (
    <>
      <PageComponent />
    </>
  );
};

export default LandingPage;
