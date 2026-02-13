import NavbarV2 from './Navbar_v2';
import ItemPanelV2 from './ItemPanel_v2';
import ModalV2 from './Modal_v2';
import { useSelector } from 'react-redux';

const HomeV2 = () => {
  const { isOpen } = useSelector((state) => state.modalV2);
  return (
    <div className="page_section">
      <NavbarV2 />
      <ItemPanelV2 pageTitle="All Items (V2)" filteredCompleted="all" />
      {isOpen && <ModalV2 />}
    </div>
  );
};

export default HomeV2;
