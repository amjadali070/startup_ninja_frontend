import { Outlet } from 'react-router-dom';
import FrontLayout from './FrontLayout';
import { PublicRoute } from '../components/RouteGuards';

const PublicLayout = () => {
  return (
    <PublicRoute>
      <FrontLayout>
        <Outlet />
      </FrontLayout>
    </PublicRoute>
  );
};

export default PublicLayout;
