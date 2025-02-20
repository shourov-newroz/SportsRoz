import generateTitle from '@/utils/routerTitle';
import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface IPageProps {
  title?: string;
  meta?: React.ReactNode;
  children: ReactNode;
}

function Page({ children, title = '', meta }: IPageProps) {
  const location = useLocation();
  const generatedTitle = generateTitle(location.pathname);

  // Use title prop first, then generated title
  const pageTitle = title || generatedTitle;

  return (
    <>
      <Helmet>
        <title>{`${pageTitle} | Card Selling`}</title>
        {meta}
      </Helmet>

      <main>{children}</main>
    </>
  );
}

export default Page;
