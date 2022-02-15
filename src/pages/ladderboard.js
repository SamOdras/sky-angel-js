import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  Button
} from "reactstrap";

const style = {
  scrollAble: {
    height: "300px",
    margin: "0em",
    padding: "10px",
    overflowY: "auto"
  }
};

export const LadderBoard = props => {
  const { open, toggleModal, rankingList } = props;

  return (
    <Modal isOpen={open} toggle={() => toggleModal(!open)}>
      <ModalBody>
        <div className="acl-block">
          <div style={style.scrollAble}>
            <h5>Ranking List ({rankingList.length}) : </h5>
            <ul>
              {rankingList.map((item, key) => {
                return <li>#{key + 1} {item.name} : {item.stars} stars</li>;
              })}
            </ul>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          type="button"
          color="secondary"
          size="sm"
          onClick={() => toggleModal(!open)}
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default React.memo(LadderBoard);
