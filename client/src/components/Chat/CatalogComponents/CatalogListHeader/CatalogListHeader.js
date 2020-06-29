import React from 'react';
import {connect} from 'react-redux';
import {changeShowModeCatalog, changeRenameCatalogMode, changeCatalogName} from "../../../../actions/actionCreator";
import {Field, reduxForm} from 'redux-form';
import styles from './CatalogHeader.module.sass';
import FormInput from '../../../FormInput/FormInput';

const validate = (values) => {
    const errors = {};
    if (!values.name || !values.name.trim().length) {
        errors.name = 'Cannot be empty';
    }
    return errors;
};

const CatalogListHeader = (props) => {
    const {handleSubmit, name, changeShowModeCatalog, changeRenameCatalogMode, isRenameCatalog, valid} = props;
    const changeCatalogName = (values) => {
        const {changeCatalogName, id} = props;
        changeCatalogName({catalogName: values.name, catalogId: id});
    };
    return (
        <div className={styles.headerContainer}>
            <i className='fas fa-long-arrow-alt-left' onClick={() => changeShowModeCatalog()}/>
            {!isRenameCatalog && <div className={styles.infoContainer}>
                <span title={name}>{name}</span>
                <i className='fas fa-edit' onClick={() => changeRenameCatalogMode()}/>
            </div>}
            {isRenameCatalog && <div className={styles.changeContainer}>
                <form onSubmit={handleSubmit(changeCatalogName)}>
                    <Field
                        name='name'
                        classes={{
                            container: styles.inputContainer,
                            input: styles.input,
                            warning: styles.fieldWarning,
                            notValid: styles.notValid
                        }}
                        component={FormInput}
                        type='text'
                        label='Catalog Name'
                    />
                    {valid && <button type='submit'>Change</button>}
                </form>
            </div>}
        </div>
    )
};


const mapStateToProps = (state) => {
    const {isRenameCatalog} = state.chatStore;
    const {name, id} = state.chatStore.currentCatalog;
    return {
        id,
        name,
        isRenameCatalog,
        initialValues: {
            name
        }
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeShowModeCatalog: () => dispatch(changeShowModeCatalog()),
        changeRenameCatalogMode: () => dispatch(changeRenameCatalogMode()),
        changeCatalogName: (data) => dispatch(changeCatalogName(data))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'catalogRename',
    validate
})(CatalogListHeader));

