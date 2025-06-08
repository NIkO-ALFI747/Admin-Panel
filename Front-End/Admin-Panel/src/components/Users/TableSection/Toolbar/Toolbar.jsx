import ButtonToolbar from "./ButtonToolbar/ButtonToolbar.jsx";
import DeleteButton from "./DeleteButton.jsx";

function Toolbar({selectedCount, blockUser, deleteUser}) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <ButtonToolbar selectedCount={selectedCount} blockUser={blockUser}/>
      <DeleteButton selectedCount={selectedCount} deleteUser={deleteUser}/>
    </div>
  );
}

export default Toolbar;