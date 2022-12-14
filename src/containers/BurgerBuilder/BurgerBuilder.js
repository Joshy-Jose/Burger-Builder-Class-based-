import React, {
    Component
} from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import classes from './BuildComponents.module.css';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrrorHandler';


const INGREDIENT_PRICE = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}
class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }
    componentDidMount() {
        console.log(this.props)
        axios.get('https://react-my-burger-4ee1e-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json')
            .then(response => {
                this.setState({
                    ingredients: response.data
                });
            })
            .catch(error => {
                this.setState({
                    error: true
                })

            })
    }


    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        }).reduce((sum, el) => {
            return sum + el;

        }, 0);
        this.setState({
            purchasable: sum > 0
        });
        console.log('purchasable', this.state.purchasable)

    }

    addIngredientHandler = (type) => {

        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients

        })
        this.updatePurchaseState(updatedIngredients);

    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }

        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients

        })
        this.updatePurchaseState(updatedIngredients);

    }
    purchaseHandler = () => {
        this.setState({
            purchasing: true
        })
    }
    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false
        });

    }
    purchaseContinueHandler = () => {
        // this.setState({loading:true})
        // const order = {
        //     ingredients:this.state.ingredients,
        //     price:this.state.totalPrice,
        //     customer: {
        //         name: 'Joshy Jose',
        //         address: {
        //             street:'teststreet',
        //             zipcode:'2255',
        //             country:'Netherlands'
        //         },
        //         email:'test@test.com'
        //     },
        //     orderType :'fastest'

        // }
        // axios.post('/orders.json',order)
        //     .then(response => {
        //         this.setState({loading:false})
        //     })
        //     .catch(error => {
        //         this.setState({loading:false})
        //     })
    }

    render() {

        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.state.error ? < p > Ingredients can not be loaded < /p> : <Spinner/ >

            if (this.state.ingredients) {
                burger = ( <
                    Aux >
                    <
                    Burger ingredients = {
                        this.state.ingredients
                    }
                    /> <
                    BuildControls ingredientAdded = {
                        this.addIngredientHandler
                    }
                    ingredientRemoved = {
                        this.removeIngredientHandler
                    }
                    purchasing = {
                        this.purchaseHandler
                    }
                    disabled = {
                        disabledInfo
                    }
                    price = {
                        this.state.totalPrice
                    }
                    ordered = {
                        this.purchaseHandler
                    }
                    /> <
                    /Aux>
                )
                orderSummary = < OrderSummary
                ingredients = {
                    this.state.ingredients
                }
                puchaseCancelled = {
                    this.purchaseCancelHandler
                }
                purchaseContinue = {
                    this.purchaseContinueHandler
                }
                price = {
                    this.state.totalPrice
                }
                />;

            }
        if (this.state.loading) {
            orderSummary = < Spinner / >
        }

        return ( <
            Aux >
            <
            Modal show = {
                this.state.purchasing
            }
            modalClosed = {
                this.purchaseCancelHandler
            } > {
                orderSummary
            } <
            /Modal>  {
                burger
            } <
            /Aux>

        );
    }


}
export default withErrorHandler(BurgerBuilder, axios);