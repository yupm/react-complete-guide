import React, { Component } from 'react';
import Fux from '../../hoc/Fux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import *  as actions from '../../store/actions/index';
import axios from '../../axios-orders';


class BurgerBuilder extends Component {
    // constructor(props){
    //     super(props);
    //     this.state= {
    //     }
    // }
    state = {
        //totalPricetotalPrice: 4,
        //purchasable: false,
        purchasing: false,
        //loading: false,
        //error: false
    }

    componentDidMount(){
        console.log(this.props);
        this.props.onInitIngredients();
    }
    
    updatePurchaseState(ingredients){

        const sum = Object.keys(ingredients)
                .map(igKey=>{
                    return  ingredients[igKey]
                })
                .reduce((sum,el)=>{
                    return sum + el;
                },0);

        return sum> 0;
    }

        // addIngredientHandler = (type) => {
        //     const oldCount = this.state.ingredients[type];
        //     const updatedCount= oldCount + 1;
        //     const updatedIngredients = {
        //         ...this.state.ingredients
        //     };
        //     updatedIngredients[type] = updatedCount;
        //     const priceAddition = INGREDIENT_PRICES[type];
        //     const oldPrice = this.state.totalPrice;
        //     const newPrice = oldPrice + priceAddition;

        //     this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        //     this.updatePurchaseState(updatedIngredients);
        // }

        // removeIngredientHandler = (type) => {
        //     const oldCount = this.state.ingredients[type];
        //     if(oldCount <= 0){
        //         return;
        //     }
        //     const updatedCount= oldCount - 1;
        //     const updatedIngredients = {
        //         ...this.state.ingredients
        //     };
        //     updatedIngredients[type] = updatedCount;
        //     const priceDeduction = INGREDIENT_PRICES[type];
        //     const oldPrice = this.state.totalPrice;
        //     const newPrice = oldPrice - priceDeduction;

        //     this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        //     this.updatePurchaseState(updatedIngredients);

        // }

    purchaseHandler = () =>{
        if(this.props.isAuthenticated){
            this.setState({purchasing: true});
        }
        else{
            console.log("Correctly set path to checkout")
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        //alert('You Continue');

        // const queryParams = [];
        // for(let i in this.state.ingredients){
        //     console.log(i);
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        // }
        // queryParams.push('price=' + this.state.totalPrice);
        // const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout'
            //search: '?' + queryString
        });
    }

    render(){
        const disabledInfo ={
            ...this.props.ings
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary= null;
        let burger = this.props.error? <p>Ingredients can't be loaded</p>: <Spinner />

        if(this.props.ings){
            burger = (
                <Fux>
                <Burger ingredients={this.props.ings}/>
                <BuildControls
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled = {disabledInfo}
                    price = {this.props.tprice}
                    purchasable={this.updatePurchaseState(this.props.ings)}
                    ordered ={this.purchaseHandler}
                    isAuth={this.props.isAuthenticated}
                />
                </Fux>
            );

            orderSummary =   <OrderSummary ingredients={this.props.ings}
            purchaseCanceled = {this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}
            price={this.props.tprice}
            />;
            
    
        }
        // if(this.state.loading){
        //     console.log("I am loading");
        //     orderSummary = <Spinner/>;
        // }

        return(
            <Fux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                  {orderSummary}
                </Modal>
                {burger}
            </Fux>
        );
    }
}

const mapStateToProps = state => {
    return{
        ings: state.burgerBuilder.ingredients,
        tprice: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !==null
    };
}

const mapDispatchToProps = dispatch => {
    return{
        onIngredientAdded: (ingName)=> dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName)=> dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path)=> dispatch(actions.setAuthRedirectPath(path))
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));