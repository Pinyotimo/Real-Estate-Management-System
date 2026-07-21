import PropTypes from "prop-types";

const OwnerActions = ({ onDelete }) => {
  return (
    <div style={{ marginTop: "1.5rem" }}>
      <button onClick={onDelete} className="dashboard-btn dashboard-btn--danger" style={{ width: "100%" }}>
        Delete Listing
      </button>
    </div>
  );
};

OwnerActions.propTypes = {
  onDelete: PropTypes.func.isRequired,
};

export default OwnerActions;