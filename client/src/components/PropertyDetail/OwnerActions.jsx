import PropTypes from "prop-types";
import Button from "../common/Button"; // reusing Button component

const OwnerActions = ({ onDelete, onEdit }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary" onClick={onEdit}>
        Edit Listing
      </Button>
      <Button variant="danger" onClick={onDelete}>
        Delete Listing
      </Button>
    </div>
  );
};

OwnerActions.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired, // new required prop
};

export default OwnerActions;