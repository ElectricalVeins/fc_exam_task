import React from 'react';
import {connect} from 'react-redux';
import {sendMessageAction} from '../../../../actions/actionCreator';
import {Field, reduxForm} from 'redux-form';
import styles from './ChatInput.module.sass';
import CONSTANTS from '../../../../constants';
import FormInput from "../../../FormInput/FormInput";


const validate = (values) => {
    const errors = {};
    if (!values.message || !values.message.trim().length) {
        errors.message = 'Cannot be empty';
    }
    return errors;
};

const ChatInput = (props) => {
    const {handleSubmit, valid} = props;

    const submitHandler = (values) => {
        const {reset} = props;
        props.sendMessage({
            conversationId: props.chatId,
            messageBody: values.message,
            //recipient: props.interlocutor.id,
            interlocutor: props.interlocutor
        });
        reset();
    };

    return (
        <div className={styles.inputContainer}>
            <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
                <Field
                    name='message'
                    component={FormInput}
                    type='text'
                    label='message'
                    classes={{
                        container: styles.container,
                        input: styles.input,
                        notValid: styles.notValid
                    }}
                />
                {valid &&
                <button type='submit'><img src={`${CONSTANTS.STATIC_IMAGES_PATH}send.png`} alt="send Message"/>
                </button>}
            </form>
        </div>
    )
};

const mapStateToProps = (state) => {
    const {interlocutor,chatId} = state.chatStore;
    const {data} = state.userStore;
    return {interlocutor, data, chatId};
};

const mapDispatchToProps = (dispatch) => {
    return {
        sendMessage: (data) => dispatch(sendMessageAction(data))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'messageForm',
    validate
})(ChatInput));
