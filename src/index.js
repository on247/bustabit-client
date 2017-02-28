import React from 'react'
import { render } from 'react-dom'
import Admin from './components/admin/index'
import App from './containers/app'
import Login from './components/login'
import Register from './components/register'
import Logout from './components/logout'
import Account from './components/account/container'
import Faucet from './components/faucet'
import Support from './components/support'
import Deposit from './components/deposit'
import Withdraw from './components/withdraw'
import Tip from './components/tip'
import Transactions from './components/transactions/container'
import Modalize from './containers/modalized'
import ModalizeSmall from './containers/modalizedSmall'
import Fair from './components/fair'

import AccountSecurity from './components/account/security'
import AccountOverview from './components/account/overview'
import AccountSettings from './components/account/settings'

import UpdatePassword  from './components/account/security-update-password'
import UpdateEmail from './components/account/security-update-email'
import TwoFactorAuthentication from './components/account/security-2fa'
import EmergencyAddress from './components/account/security-emergency-address'
import AccountSecurityMenu from './components/account/security-menu'


import FaqContainer from './components/faq/container'
import FaqMenu from './components/faq/menu'
import HowToPlay from './components/faq/how-to-play'
import WhatIsABit from './components/faq/what-is-a-bit'
import GrossProfit from './components/faq/gross-profit'
import DepositAddressValid from './components/faq/how-long-is-the-deposit-address-valid'
import HowToDeposit from './components/faq/how-to-deposit'
import HowLongDoDepositsTake from './components/faq/how-long-do-deposits-take'
import HowToWithdraw from './components/faq/how-to-withdraw'
import GameDisconnect from './components/faq/game-disconnect'
import GameLimit from './components/faq/game-limit'
import MaxBet from './components/faq/max-bet'
import GameOdds from './components/faq/game-odds'
import GameBustCalc from './components/faq/game-bust-calc'
import IsTheGameFair from './components/faq/is-the-game-fair'
import HowToVerifyGameResults from './components/faq/how-to-verify-game-results'
import ForcedCashOut from './components/faq/forced-cash-out'
import OtherGamblingRecommendations from './components/faq/other-gambling-recommendations'
import GamblingAddiction from './components/faq/gambling-addiction'
import WhatIsBustabit from './components/faq/what-is-bustabit'
import HouseEdge from './components/faq/house-edge'
import SupportFaq from './components/faq/support'
import BugBounty from './components/faq/bug-bounty'
import ChatCommands from './components/faq/chat-commands'
import MobileApp from './components/faq/mobile-app'
import HowDoesTheBankrollWork from './components/faq/how-does-the-bankroll-work'
import WhatIsValor from './components/faq/what-is-valor'
import WhatIsSilver from './components/faq/what-is-silver'
import FaucetFaq from './components/faq/faucet'
import HowToTip from './components/faq/how-to-tip'
import HowToTrade from './components/faq/how-to-trade'

import HowCanIContributeAsBankroller from './components/faq/how-can-i-contribute-as-bankroller'
import BankrollCommission from './components/faq/bankroll-commission'
import NewBankrollerFee from './components/faq/new-bankroller-fee'
import BankrollPotentialRisk from './components/faq/bankroll-potential-risk'
import BankrollPotentialProfit from './components/faq/bankroll-potential-profit'

import DepositHistory from './components/transactions/deposit-history'
import WithdrawalHistory from './components/transactions/withdrawal-history'
import TipHistory from './components/transactions/tip-history'

import Bankroll from './components/bankroll/container'
import BankrollOverview from './components/bankroll/overview'
import AddToBankroll from './components/bankroll/add-to-bankroll'
import RemoveFromBankroll from './components/bankroll/remove-from-bankroll'
import BankrollHistory from './components/bankroll/history'

import TradeCenterContainer from './components/trade/container'
import CreateTrade from './components/trade/create-trade'
import MyTrades from './components/trade/my-trades'
import OrderBook from './components/trade/order-book'


import AddFriend from './components/add-friend'

import GameInformation from './components/game-information'
import BetInformation from './components/bet-information'

import UserPage from './components/user-page'

import ForgotPassword from './components/forgot-password'
import ResetPassword from './components/reset-password'
import WithdrawalFee from './components/faq/withdrawal-fee'
import TipFee from './components/faq/tip-fee'
import QueuedWithdrawals from './components/transactions/queued-withdrawals'
import Fuse from './components/fuse'
import HowToFuse from './components/faq/how-to-fuse'

import AccountSettingsMenu from './components/account/settings-menu'
import DeleteAccount from './components/account/settings-delete-account'
import SelfBan from './components/account/self-ban'
import Mute from './components/chat/mute'

import { Router, Route, browserHistory } from 'react-router'



const history = browserHistory;


function NoMatch() {
  return <img src={ require('../img/dice.png') } alt="dice"/>;
}


function createTitleComponent(name) {
  return () => <span>{name}</span>
}

if (!localStorage.getItem('devwarning')) {
	alert('This is a *VERY ROUGH* DEV version, that uses bitcoin TESTCOINS (not real bitcoin) and the database will regularly be reset.');
	localStorage.setItem('devwarning', true);
}



render(
    <Router history={history}>
      <Route path="/" component={App}>
        <Route component={Modalize}>
          <Route path="login" components={{title: createTitleComponent("Login"), body: Login}}/>
          <Route path="logout" components={{title: createTitleComponent("Logout"), body: Logout}}/>
          <Route path="register" components={{title: createTitleComponent("Register"), body: Register}}/>
          <Route path="forgot-password" components={{title: createTitleComponent("Forgot Password"), body: ForgotPassword}}/>
					<Route path="reset-password/:uuid" components={{title: createTitleComponent("Reset Password"), body: ResetPassword}}/>
          <Route path="account" components={ {title: createTitleComponent("Account"), body: Account} } />
          <Route components={ {title: createTitleComponent("Account"), body: Account} } >
            <Route path="account/overview" components={{ body: AccountOverview }}/>
            <Route path="account/stats" components={{ body: UserPage }}/>
            <Route components={{ body: AccountSecurity }} >
              <Route path="account/security" components={ { body: AccountSecurityMenu} }/>
              <Route path="account/security/update-password" components={ { body: UpdatePassword} }/>
              <Route path="account/security/update-email" components={ { body: UpdateEmail} }/>
              <Route path="account/security/2fa" components={ { body: TwoFactorAuthentication} }/>
              <Route path="account/security/emergency-address" components={ { body: EmergencyAddress} }/>
            </Route>
						<Route components={{ body: AccountSettings }} >
							<Route path="account/settings" components={ { body: AccountSettingsMenu} }/>
							<Route path="account/settings/delete-account" components={ { body: DeleteAccount} }/>
							<Route path="account/settings/self-ban" components={{ body: SelfBan}}/>
						</Route>
					</Route>

          <Route components={ {title: createTitleComponent("Transactions"), body: Transactions} } >
            <Route path="transactions/deposits" components={ { body: DepositHistory } }/>
            <Route path="transactions/withdrawals" components={ { body: WithdrawalHistory} }/>
            <Route path="transactions/tips" components={ { body: TipHistory} }/>
          </Route>

          <Route components={ {title: createTitleComponent("Bankroll"), body: Bankroll} } >
            <Route path="bankroll/overview" components={{ body: BankrollOverview }}/>
            <Route path="bankroll/add-to-bankroll" components={ { body: AddToBankroll } }/>
            <Route path="bankroll/remove-from-bankroll" components={ { body: RemoveFromBankroll} }/>
            <Route path="bankroll/history" components={ { body: BankrollHistory} }/>
          </Route>

          <Route components={ {title: createTitleComponent("Trade Center"), body: TradeCenterContainer} } >
            <Route path="trade/order-book" components={{ body: OrderBook }}/>
            <Route path="trade/create-trade" components={{ body: CreateTrade }}/>
            <Route path="trade/my-trades" components={ { body: MyTrades} }/>
          </Route>
          <Route path="game/:gameId" components={{title: createTitleComponent("Game Information"), body: GameInformation}} />
          <Route path="bet/:betId" components={{title: createTitleComponent("Bet Information"), body: BetInformation}} />
					<Route path="user/:uname" components={{title: createTitleComponent("User Stats"), body: UserPage}} />
          <Route path="faucet" components={{title: createTitleComponent("Faucet"), body: Faucet}}/>
          <Route path="support" components={{title: createTitleComponent("Support"), body: Support}}/>
          <Route path="fair" components={ {title: createTitleComponent("Provably Fair"), body: Fair} }/>
          <Route path="deposit" components={{title: createTitleComponent("Deposit"), body: Deposit}}/>
          <Route path="withdraw" components={{title: createTitleComponent("Withdraw"), body: Withdraw}}/>
          <Route path="queued-withdrawals" components={{title: createTitleComponent("Queued Withdrawals"), body: QueuedWithdrawals}}/>
          <Route path="fuse" components={{title: createTitleComponent("Fuse"), body: Fuse}}/>

          <Route path="tip" components={{title: createTitleComponent("Send a Tip"), body: Tip}}/>
          <Route path="faq" components={{title: createTitleComponent("Frequently Asked Questions"), body: FaqMenu}} />
          <Route components={{title: createTitleComponent("Frequently Asked Questions"), body: FaqContainer}}>
            <Route path="faq/how-to-play" components={ { body: HowToPlay} }/>
            <Route path="faq/what-is-a-bit" components={ { body: WhatIsABit} }/>
            <Route path="faq/gross-profit" components={ { body: GrossProfit} }/>
            <Route path="faq/how-long-is-the-deposit-address-valid" components={ { body: DepositAddressValid} }/>
            <Route path="faq/how-to-deposit" components={ { body: HowToDeposit} }/>
            <Route path="faq/how-long-do-deposits-take" components={ { body: HowLongDoDepositsTake} }/>
            <Route path="faq/how-to-withdraw" components={ { body: HowToWithdraw} }/>
            <Route path="faq/what-happens-if-disconnected" components={ { body: GameDisconnect} }/>
            <Route path="faq/how-high-can-the-game-go" components={ { body: GameLimit} }/>
            <Route path="faq/max-bet" components={ { body: MaxBet} }/>
            <Route path="faq/game-odds" components={ { body: GameOdds} }/>
            <Route path="faq/bust-calculation" components={ { body: GameBustCalc} }/>
            <Route path="faq/is-the-game-fair" components={ { body: IsTheGameFair} }/>
            <Route path="faq/how-to-verify-game-results" components={ { body: HowToVerifyGameResults} }/>
            <Route path="faq/forced-cash-out" components={ { body: ForcedCashOut} }/>
            <Route path="faq/other-gambling-recommendations" components={ { body: OtherGamblingRecommendations} }/>
            <Route path="faq/gambling-addiction" components={ { body: GamblingAddiction} }/>
            <Route path="faq/what-is-bustabit" components={ { body: WhatIsBustabit} }/>
            <Route path="faq/house-edge" components={ { body: HouseEdge} }/>
            <Route path="faq/support" components={ { body: SupportFaq} }/>
            <Route path="faq/bug-bounty" components={ { body: BugBounty} }/>
            <Route path="faq/chat-commands" components={ { body: ChatCommands} }/>
            <Route path="faq/mobile-app" components={ { body: MobileApp} }/>
            <Route path="faq/what-is-valor" components={ { body: WhatIsValor} }/>
            <Route path="faq/what-is-silver" components={ { body: WhatIsSilver} }/>
            <Route path="faq/how-does-the-bankroll-work" components={ { body: HowDoesTheBankrollWork} }/>
            <Route path="faq/withdrawal-fee" components={ { body: WithdrawalFee} }/>
            <Route path="faq/tip-fee" components={ { body: TipFee} }/>

            <Route path="faq/how-can-i-contribute-as-bankroller" components={ { body: HowCanIContributeAsBankroller} }/>
            <Route path="faq/bankroll-commission" components={ { body: BankrollCommission} }/>
            <Route path="faq/new-bankroller-fee" components={ { body: NewBankrollerFee} }/>
            <Route path="faq/bankroll-potential-risk" components={ { body: BankrollPotentialRisk} }/>
            <Route path="faq/bankroll-potential-profit" components={ { body: BankrollPotentialProfit} }/>

            <Route path="faq/faucet" components={ { body: FaucetFaq} }/>
            <Route path="faq/how-to-trade" components={ { body: HowToTrade} }/>
            <Route path="faq/how-to-tip" components={ { body: HowToTip} }/>
						<Route path="faq/how-to-fuse" components={ { body: HowToFuse} }/>

          </Route>
					<Route path="mute" components={{title: createTitleComponent("Mute"), body: Mute}}/>
          <Route path="admin" components={{title: createTitleComponent("Admin"), body: Admin }}/>

        </Route>
				<Route component={ModalizeSmall}>
					<Route path="add-friend" components={{title: createTitleComponent("Add Friend"), body: AddFriend}}/>

				</Route>
        <Route path="*" component={NoMatch}/>
      </Route>
    </Router>,
  document.getElementById('root')
);
