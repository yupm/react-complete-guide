import React, { Component} from 'react';
import Button from '../../../components/UI/Button/Button';

import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';

import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';

class ContactData extends Component {
    state={
        orderForm:{
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name',
                },
                value: '',
                validation:{
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street',
                },
                value: '',
                validation:{
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code',
                },
                value: '',
                validation:{
                    required: true,
                    minLength: 5,
                    maxLength: 5,
                },
                valid: false,
                touched: false
            },
            country:{
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country',
                },
                value: '',
                validation:{
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email',
                },
                value: '',
                validation:{
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                        ]
                },
                value: 'fastest',
                validation: {},
                valid: true
            }
        },
        loading: false,
        formIsValid: false
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }



    orderHandler = ( event ) => {
        event.preventDefault();

        //this.setState({loading: true});

        const formData = {};
        for(let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,    //do not use on real app
            orderData: formData,
            userId: this.props.userId
        }
        this.props.onOrderBurger(order, this.props.token);
        
        // axios.post('/orders.json', order)
        //     .then(response=>{
        //         this.setState({loading: false});
        //         this.props.history.push('/');
        //         console.log(response);
        //     })
        //     .catch(error=>{
        //         this.setState({loading: false});
        //         console.log(error);
        //     });

        console.log(this.props.ingredients);
    }

    
    inputChangedHandler = (event, inputIdentifier) => {
            const updatedOrderForm = {
                ...this.state.orderForm
            }
            const updatedFormElement = {...updatedOrderForm[inputIdentifier]};
            updatedFormElement.value  = event.target.value;
            updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);       
            updatedFormElement.touched= true;  
            updatedOrderForm[inputIdentifier] = updatedFormElement;
            
            let formIsValid = true;
            for(let inputIdentifier in updatedOrderForm){
                formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
            }
            
            this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid});

    }

    render(){
        const formElementsArray = [];
        for (let key in this.state.orderForm){
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (                
        <form onSubmit={this.orderHandler}>
            {formElementsArray.map(formElement => (
                <Input 
                    key={formElement.id}
                    elementType={formElement.config.elementType}  
                    elementConfig={formElement.config.elementConfig}    
                    value={formElement.config.value}
                    changed={(event) => this.inputChangedHandler(event, formElement.id)}
                    shouldValidate = {formElement.config.validation}
                    invalid={!formElement.config.valid}
                    touched={formElement.config.touched}
                />))}
            <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
        </form>
);
        if(this.props.loading){
            form = <Spinner/>;
        }
        return(
            <div className={classes.ContactData}>
                <h4>Enter your Contact data</h4>
                {form}
            </div>
        );
    }

}

const mapStateToProps = state =>{
    return{
        ingredients: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return{
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios)) ;