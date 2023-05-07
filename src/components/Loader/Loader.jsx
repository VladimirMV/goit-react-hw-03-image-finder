
import { PropagateLoader } from 'react-spinners';
import './Loader.css';

const Loader = () => {
  return (
    <div className="Spinner">
      <PropagateLoader
        size="15"
        color="rgb(37, 37, 173)"
       loading={true}
      />
    </div>
  );
};

export default Loader;