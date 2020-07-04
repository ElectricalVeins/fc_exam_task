import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createDialogAction, goToExpandedDialog } from '../../actions/actionCreator';

const OpenDialogButton = props => {
  const {dialogsPreview, interlocutor} = props;

  const conversationInfo = (dialogsPreview, interlocutorId) => {
    for (const dialog of dialogsPreview) {
      if (interlocutorId === dialog.interlocutorId || interlocutorId === dialog.UserId) {
        return dialog.id;
      }
    }
    return null;
  };

  const goChat = () => {
    const chatId = conversationInfo(dialogsPreview, interlocutor.id);
    if (!chatId) {
      props.createDialog({interlocutor});
    } else {
      props.goToExpandedDialog({interlocutor, chatId});
    }
  };
  return (
    <i onClick={goChat} className="fas fa-comments"/>
  );
};

OpenDialogButton.propTypes = {
  dialogsPreview: PropTypes.array.isRequired,
  interlocutor: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    createDialog: data => dispatch(createDialogAction(data)),
    goToExpandedDialog: data => dispatch(goToExpandedDialog(data)),
  };
};

export default connect(null, mapDispatchToProps)(OpenDialogButton);
