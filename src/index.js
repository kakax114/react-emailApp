import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { render } from 'react-dom';
import {} from  'react-transition-group'
import { $ } from 'jquery'
import { Button, Row, Col, Badge } from 'reactstrap';
import '/index.css'

//state store-------------------------------------------
class Email {
  @observable id
  @observable from
  @observable address
  @observable time
  @observable message
  @observable subject
  @observable tag
  @observable read

  constructor(from, address, time, message, subject, tag, read) {
    this.id = Math.random()
    this.from = from
    this.address = address
    this.time = time
    this.message = message
    this.subject = subject
    this.tag = tag
    this.read = read
  }
}

class Emails {
  @observable emails = []
  @observable category = 'inbox'
  @observable currentEmail = ''
  @observable rightPane = <div></div>
  deleteEmail(email) {
    if (email.tag === 'trash') {
      //permanetly delete
      let index = this.emails.map(el => el.id).indexOf(email.id)
      this.emails.splice(index, 1)
    } else {
      //move to trash
      email.tag = 'trash'
    }
  }
  isRead(email) {
    if (!email.read) { email.read = true }
  }
  updateCurrentEmail(email, category) {
    try { //currentEmail will the be the first item in selected caategory
      this.currentEmail = this.emails.filter(el => el.tag === category)[0]
    } catch (err) { //if list is empty
      this.currentEmail = ''
    }
  }
}

//view---------------------------------------------------
@observer class EmailView extends React.Component {
  changeCategory(category) {
    this.props.store.category = category
    this.props.store.currentEmail = ''
    this.props.store.rightPane = <div></div>
  }
  currentEmail(el) {
    this.props.store.currentEmail = el
    this.props.store.isRead(el)
    this.props.store.rightPane =
      <div>
        <div style={rightPaneTopBarStyle}>
          <Row>
            <Col md='6'>
              <p style={rightPaneEmailTitleStyle}>{el.subject}</p>
              <p style={rightPaneEmaiSenderStyle}>{el.address}</p>
            </Col>
            <Col md='6'>
            <p className='text-right rightPaneEmailIconStyle'>
                <i className="fa fa-trash-o" onClick={this.deleteEmail.bind(this, el)}></i>
              </p>
              <p className="text-right" style={rightPaneEmailTimeStyle}>{el.time}</p>
            </Col>
          </Row>
        </div>
        <div style={{ "padding": "16px", 'fontSize':'13px' }}>
          <p>{el.message}</p>
        </div>
      </div>
  }
  deleteEmail(email) {
    this.props.store.deleteEmail(email)
    this.props.store.updateCurrentEmail(email, this.props.store.category)
    let temp = this.props.store.currentEmail
    if (temp !== undefined) { //is catergory list is empty currentEmail will be undefined
      this.currentEmail(temp)
    } else {
      this.props.store.rightPane = <div></div>
    }

  }
  render() {
    let { emails, category, currentEmail, rightPane } = this.props.store
    //if 
    let list = emails.filter(el => el.tag === category).map(el =>
      <div onClick={this.currentEmail.bind(this, el)}
        className={currentEmail === el ? 'emailItemStylePressed' : el.read === false ? 'unreadEmailItemStyle' : 'emailItemStyle'}>
        <p style={emailItemTitleStyle}>{el.subject}</p>
        <Row>
          <Col md='6'>
            <p style={emailItemSenderAndTimeStyle}>{el.from}</p>
          </Col>
          <Col md='6'>
            <p className="text-right" style={emailItemSenderAndTimeStyle}>{el.time}</p>
          </Col>
        </Row>
      </div>
    )
    return (
      <div style={{ "backgroundColor": "rgba(0,0,0,0.71)" }}>
        <div style={{ "width": "1025px", "margin": "auto", "height": "40px" }}>
        </div>
        <Row style={frameStyle}>
          <Col md='1'></Col>
          <Col md='2' style={leftPaneStyle}>
            <div className='composeStyle'>
              <p style={composeTextStyle}>
                Compose
                <i className="fa fa-pencil" style={{ "fontSize": "13px", "paddingLeft": "4px" }}></i>
              </p>
            </div>
            <div style={{ "paddingTop": "50px" }}>
              <div onClick={this.changeCategory.bind(this, 'inbox')}
                className={category === 'inbox' ? 'leftPaneItemHighlight' : 'leftPaneItem'}>
                <p style={leftPaneText}>
                  <i className="fa fa-inbox" style={leftPaneIcon}></i>
                  Inbox
                  <span className="Badge" style={leftPaneBadge,{paddingLeft:59}}>
                    {emails.filter(el => el.tag === 'inbox' && el.read === false).length}
                  </span>
                </p>
            </div>
            <div onClick={this.changeCategory.bind(this, 'sent')}
              className={category === 'sent' ? 'leftPaneItemHighlight' : 'leftPaneItem'}>
              <p style={leftPaneText}>
                <i className="fa fa-send" style={leftPaneIcon}></i>
                Sent
                  <span className="Badge" style={leftPaneBadge,{paddingLeft:63}}>
                    {emails.filter(el => el.tag === 'sent').length}
                  </span>
                </p>
              </div>
          <div onClick={this.changeCategory.bind(this, 'draft')}
            className={category === 'draft' ? 'leftPaneItemHighlight' : 'leftPaneItem'}>
            <p style={leftPaneText}>
              <i className="fa fa-edit" style={leftPaneIcon}></i>
              Drafts
              <span className="Badge" style={leftPaneBadge,{paddingLeft:54}}>
                {emails.filter(el => el.tag === 'draft').length}
              </span>
            </p>
          </div>
        <div onClick={this.changeCategory.bind(this, 'trash')}
          className={category === 'trash' ? 'leftPaneItemHighlight' : 'leftPaneItem'}>
          <p style={leftPaneText}>
            <i className="fa fa-trash" style={leftPaneIcon}></i>
            Trash
            <span className="Badge" style={leftPaneBadge,{paddingLeft:61}}>
              {emails.filter(el => el.tag === 'trash').length}
            </span>
          </p>
          </div>
        </div >
      </Col >

      <Col md='3' style={midPaneStyle}>
        {list}
      </Col>

      <Col md='5' style={rightPaneStyle}>
        {rightPane}
      </Col>

      <Col md={{ size: 10, offset: 1 }} style={footerStyle}>
        <p className="text-center" style={footerTextStyle}>
          Created By Carter X. Build With React, Mobx & Reactstrap (Bootstrap).
            </p>
      </Col>
        </Row >
      <div style={{ "width": "1025px", "margin": "auto", "height": "500px" }}>
      </div>
      </div >
    );
  }
}
const composeTextStyle = {
  "margin": "0",
  "color": "white",
  "padding": "43px",
  "fontSize": "15px",
  "paddingTop": "29px"
}
const frameStyle = {
  "width": "1025px",
  "margin": "auto",
  "height": "450px",
  "marginTop": "9%"
}
const composeStyle = {
  "background": "rgb(48,120,184)",
  "padding": "0",
  "margin": "0",
  "height": "75px",
  "cursor": "pointer"
}
const footerStyle = {
  "padding": "0",
  "backgroundColor": "rgb(244,239,239)",
  "border": "1px solid rgb(239,231,231)"
}
const footerTextStyle = {
  "padding": "14px",
  "color": "rgb(108,115,123)",
  "margin": "-5px",
  "fontSize": "12px"
}
const rightPaneTopBarStyle = {
  "background": "rgb(245,245,248)",
  "padding": "21px",
  "margin": "0",
  "height": "75px",
  "paddingTop": "16px"
}
const rightPaneEmailIconStyle = {
  "margin": "0",
  "color": "rgba(44,53,67,0.66)",
  "fontSize": "14px",
  "paddingRight": "8px",
  "cursor": "pointer"
}
const rightPaneEmailTimeStyle = {
  "margin": "0",
  "color": "rgba(44,53,67,0.66)",
  "fontSize": "14px",
  "paddingTop": "10px"
}
const rightPaneEmaiSenderStyle = {
  "margin": "0",
  "color": "rgba(44,53,67,0.66)",
  "fontSize": "14px",
  "paddingTop": "6px"
}
const rightPaneEmailTitleStyle = {
  "margin": "0",
  "color": "#2c3543",
  "fontSize": "16px",
  "width":"400px"
}
const rightPaneStyle = {
  "padding": "0",
  "height": "450px",
  "backgroundColor": "white",
  "borderRight": "1px solid rgb(232,228,228)"
}
const emailItemSenderAndTimeStyle = {
  "fontSize": "11px",
  "color": "grey"
}
const emailItemTitleStyle = {
  "fontSize": "15px",
  "width": "700px"
}
const emailItemStyle = {
  "padding": "12px",
  "height": "75px",
  "borderBottom": "1px solid rgb(241,236,236)",
  "cursor": "pointer"
}
const midPaneStyle = {
  "padding": "0",
  "maxHeight": "450px",
  "overflowY": "scroll",
  "overflowX": "hidden",
  "backgroundColor": "#f8f6f6"
}
const leftPaneStyle ={
  "padding": "0",
  "background": "#2c3543",
  "height": "450px"
}
const leftPaneItem={
  "paddingTop": "13px",
  "paddingBottom": "14px",
  "marginBottom": "10px",
  "cursor": "pointer"
}
const leftPaneText={
  "margin": "0",
  "color": "white",
  "fontSize": "13px",
  "paddingLeft": "10px"
}
const leftPaneIcon={
  "fontSize": "14px",
  "marginLeft": "4px",
  "marginRight": "13px"
}
const leftPaneBadge={
  "marginLeft": "58px",
  "borderRadius": "5px",
  "fontSize": "10px",
  "backgroundColor": "rgb(42,50,61)"
}

const store = new Emails();
render(<EmailView store={store} />, document.getElementById('root'));

//test action--------------------------------------------
store.emails.push(
  new Email(
    'Jolene Griffin', 
    'Duis.at.lacus@leoelementum.net', 
    'Sat, Jan 12', 
    'inceptos hymenaeos. Mauris ut quam vel sapien imperdiet ornare. In faucibus. Morbi vehicula. Pellentesque tincidunt tempus risus. Donec egestas. Duis ac arcu. Nunc mauris. Morbi non sapien molestie orci tincidunt adipiscing. Mauris molestie pharetra nibh. Aliquam ornare, libero at auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus justo eu arcu. Morbi sit amet massa. Quisque porttitor eros nec tellus. Nunc lectus pede, ultrices a, auctor non, feugiat nec, diam. Duis mi enim, condimentum eget, volutpat ornare, facilisis eget, ipsum. Donec sollicitudin adipiscing ligula.', 
    '	Learn How To Start email', 
    'inbox', 
    true
  )
)

store.emails.push(
  new Email(
    'Cairo Christian',
    'Integer.vitae.nibh@Phasellus.net',
    'Sat, Jul 01',
    'inceptos hymenaeos. Mauris ut quam vel sapien imperdiet ornare. In faucibus. Morbi vehicula. Pellentesque tincidunt tempus risus. Donec egestas. Duis ac arcu. Nunc mauris. Morbi non sapien molestie orci tincidunt adipiscing. Mauris molestie pharetra nibh. Aliquam ornare, libero at auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus justo eu arcu. Morbi sit amet massa. Quisque porttitor eros nec tellus. Nunc lectus pede, ultrices a, auctor non, feugiat nec, diam. Duis mi enim, condimentum eget, volutpat ornare, facilisis eget, ipsum. Donec sollicitudin adipiscing ligula.',
    'The Ultimate Guide To react',
    'inbox',
    false
  )
)

store.emails.push(
  new Email(
    'Allistair Porter',
    'sed@ipsumcursusvestibulum.edu',
    'Sat, Jan 12',
    'lorem tristique aliquet. Phasellus fermentum convallis ligula. Donec luctus aliquet odio. Etiam ligula tortor, dictum eu, placerat eget, venenatis a, magna. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Etiam laoreet, libero et tristique pellentesque, tellus sem mollis dui, in sodales elit erat vitae risus. Duis a mi fringilla mi lacinia mattis. Integer eu lacus. Q',
    '	The Ultimate Guide To react',
    'sent',
    true
  )
)

store.emails.push(
  new Email(
    'Wade Byrd',
    'adipiscing@mattisornare.org',
    'Sat, Feb 10',
    'iat non, lobortis quis, pede. Suspendisse dui. Fusce diam nunc, ullamcorper eu, euismod ac, fermentum vel, mauris. Integer sem elit, pharetra ut, pharetra sed, hendrerit a, arcu. Sed et libero. Proin mi. Aliquam gravida mauris ut mi. Duis risus odio, auctor vitae, aliquet nec, imperdiet',
    'Join Us On Saturday',
    'trash',
    true
  )
)

store.emails.push(
  new Email(
    'Jason Patton',
    'lorem@semelit.edu',
    'Thu, Apr 06',
    'consectetuer ipsum nunc id enim. Curabitur massa. Vestibulum accumsan neque et nunc. Quisque ornare tortor at risus. Nunc ac sem ut dolor dapibus gravida. Aliquam',
    'The Best edit Ever!',
    'inbox',
    false
  )
)

store.emails.push(
  new Email(
    'Orlando Mcfarland',
    'ac@felis.com',
    'Fri, Mar 02',
    'istique senectus et netus et malesuada fames ac turpis egestas. Aliquam fringilla curs',
    'New job Listing',
    'inbox',
    true
  )
)

store.emails.push(
  new Email(
    'Xyla Horton',
    '	et@Duisgravida.ca',
    'Tue, Nov 06',
    'facilisi. Sed neque. Sed eget lacus. Mauris non dui nec urna suscipit nonummy. Fusce ferme',
    'Verify your facebook account',
    'inbox',
    true
  )
)

store.emails.push(
  new Email(
    'JoleneGriffin',
    'eu.dolor@in.org',
    'Sun, Nov 04',
    'ipit, est ac facilisis facilisis, magna tellus faucibus leo, in lobortis tellus justo sit amet nulla. Donec non justo. Proin non massa n',
    'Your Mercury Bill',
    'inbox',
    false
  )
)

store.emails.push(
  new Email(
    'Jacqueline Warner',
    'vulputate.risus.a@ut.ca',
    'Sun, Nov 0',
    'eleifend egestas. Sed pharetra, felis eget varius ultrices, mauris ipsum porta elit, a feugiat tellus lorem eu metus. In lorem. Donec elementum, lorem ut aliquam iaculis, lacus pede sagittis augue, eu tempor erat neque non quam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis eges',
    'Update Report',
    'inbox',
    true
  )
)

store.emails.push(
  new Email(
    'Rachel Guerrero',
    'adipiscing@mattisornare.org',
    'Sat, Nov 24',
    'uspendisse commodo tincidunt nibh. Phasellus nulla. Integer vulputate, risus a ultricies adipiscing, enim mi tempor lorem, eget mollis lectus pede ',
    '3 Tools to Simplify Your Marketing',
    'trash',
    true
  )
)

store.emails.push(
  new Email(
    'Victor Ramsey',
    'leo.Vivamus.nibh@Sednuncest.ca',
    'Tue, Feb 14',
    ' iaculis enim, sit amet ornare lectus justo eu arcu. Morbi sit amet massa. Quisque porttitor eros n',
    'Winner',
    'trash',
    true
  )
)

store.emails.push(
  new Email(
    'Ian French',
    'adipiscing@mattisornare.org',
    'Wed, Jul 19',
    'met metus. Aliquam erat volutpat. Nulla facilisis. Suspendisse commodo tincidunt nibh. Phasellus nulla. Integer vulputate, risus a ultricie',
    'Meet Dave',
    'sent',
    true
  )
)

store.emails.push(
  new Email(
    'Drew Blevins',
    'risus.quis@duiCras.com',
    'Mon, Jun 25',
    'llentesque a, facilisis non, bibendum sed, est. Nunc laoreet lectus quis massa. Mauris vestibulum, neque sed dictum eleifend, nunc risus varius ',
    'DigitalMarketer’s 101',
    'sent',
    true
  )
)

store.emails.push(
  new Email(
    'Boris Gross',
    'risus.at.fringilla@apurusDuis.com',
    'Sat, Jun 02',
    'in consectetuer ipsum nunc id enim. Curabitur massa. Vestibulum accumsan neque et nunc. Quisque ornare tortor at risus. Nunc ac sem ut dolor dapibus gravida. Aliquam tincidunt, nunc ac mattis ornare, lectus ante dictum mi, ac mattis velit justo nec ante. Maecenas mi felis, adipiscing fringilla, porttitor vulputate, posuere vulputate, lacus. Cras interdum. Nunc sollicitudin',
    'New Login from 101.323.21.4',
    'inbox',
    false
  )
)

store.emails.push(
  new Email(
    'Karly Burt',
    'ultricies@miac.net',
    'Sat, Jun 02',
    'enas malesuada fringilla est. Mauris eu turpis. Nulla aliquet. Proin velit. Sed malesuada augue ut lacus. Nulla tincidunt, neque vitae semper egestas, urna justo',
    'Test',
    'sent',
    true
  )
)


