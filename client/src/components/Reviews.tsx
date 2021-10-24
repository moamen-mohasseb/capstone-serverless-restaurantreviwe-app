import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createreview, deletereview, getreviews, updatereview } from '../api/reviews-api'
import Auth from '../auth/Auth'
import { Review } from '../types/Review'

interface reviewsProps {
  auth: Auth
  history: History
}

interface reviewsState {
  reviews: Review[]
  newreviewName: string
  newReviewDetails: string
  newReviewDegree: Number
  loadingreviews: boolean
}

export class Reviews extends React.PureComponent<reviewsProps, reviewsState> {
  state: reviewsState = {
    reviews: [],
    newreviewName: '',
    newReviewDetails: '',
    newReviewDegree: 1,
    loadingreviews: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newreviewName: event.target.value })
  }
  handleReviewDetailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReviewDetails: event.target.value })
  }
  handleReviewDegreeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReviewDegree : Number(event.target.value) })
  }

  onEditButtonClick = (reviewId: string) => {
    this.props.history.push(`/reviews/${reviewId}/edit`)
  }

  onreviewCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      if(this.state.newReviewDegree>=0&&this.state.newReviewDegree<=5)
      {if(this.state.newreviewName.length>0){
      const dueDate = this.calculateDueDate()
      const newreview = await createreview(this.props.auth.getIdToken(), {
        restaurantName: this.state.newreviewName ,
        reviewDetails:this.state.newReviewDetails,
        reviewDegree:this.state.newReviewDegree,
        dueDate
      })
      this.setState({
        reviews: [...this.state.reviews, newreview],
        newreviewName: ''
      })}
      else{alert('Enter restaurantName')}}
      else{alert('Review Degree from 0 to 5')}
    } catch {
      alert('review creation failed')
    }
  }

  onreviewDelete = async (reviewId: string) => {
    try {
      await deletereview(this.props.auth.getIdToken(), reviewId)
      this.setState({
        reviews: this.state.reviews.filter(review => review.reviewId !== reviewId)
      })
    } catch {
      alert('review deletion failed')
    }
  }

  onreviewCheck = async (pos: number) => {
    try {
      const review = this.state.reviews[pos]
      console.log(this.props.auth.getIdToken(), review.reviewId, {
        name: review.restaurantName,
        dueDate: review.dueDate,
        done: !review.done
      })
      await updatereview(this.props.auth.getIdToken(), review.reviewId, {
        name: review.restaurantName,
        dueDate: review.dueDate,
        done: !review.done
      })
      this.setState({
        reviews: update(this.state.reviews, {
          [pos]: { done: { $set: !review.done } }
        })
      })
    } catch(error:any) {
      alert(`review Update failed ${error.message}`)
    }
  }

  async componentDidMount() {
    try {
      const reviews = await getreviews(this.props.auth.getIdToken())
      this.setState({
        reviews,
        loadingreviews: false
      })
    } catch (e : any) {
      alert(`Failed to fetch reviews: ${e.message}`)
    }
  }
  render() {
    return (
      <div>
        <Header as="h1">Reviews</Header>

        {this.renderCreatereviewInput()}

        {this.renderreviews()}
      </div>
    )
  }

  renderCreatereviewInput() {
    return (
      <Grid.Row>
        <Grid.Column width={10}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Restaurant Name',
              onClick: this.onreviewCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Restaurant Name...   "
            onChange={this.handleNameChange}
          />      
           
    
         
        </Grid.Column>
        <Grid.Column width={10}>
          <Divider />
        </Grid.Column>
        <Grid.Column width={10}>
        <Input
            action={{
              color: 'Teal',
              labelPosition: 'left',
              content: 'Review Degree  ',
             // onClick: this.onreviewCreate
            }}
            actionPosition="left"
           // placeholder="Review Degree...  "
            Value="0"
            onChange={this.handleReviewDegreeChange}
          />       
          </Grid.Column>
          <Grid.Column width={10}>
          <Divider />
        </Grid.Column>
        <Grid.Column width={10}>
        <Input
          action={{
            color: 'Teal',
            labelPosition: 'left',
           
            content: 'Review Details',
            
          }}
            fluid
            actionPosition="left"
            placeholder="Review Details..."
            onChange={this.handleReviewDetailsChange}
          />  
        </Grid.Column>
        <Grid.Column width={10}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    
    )
  }

  renderreviews() {
    if (this.state.loadingreviews) {
      return this.renderLoading()
    }

    return this.renderreviewsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading reviews
        </Loader>
      </Grid.Row>
    )
  }

  renderreviewsList() {
    return (
      <Grid padded>
        {this.state.reviews.map((review, pos) => {
          return (
            <Grid padded>
            <Grid.Row key={review.reviewId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onreviewCheck(pos)}
                  checked={review.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {review.restaurantName}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {review.reviewDegree}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(review.reviewId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onreviewDelete(review.reviewId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
             
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
            <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
              <Grid.Column width={16}>
              { review.attachmentUrl && (
                <Image src={review.attachmentUrl} size="small" wrapped />
              )}
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
              <Grid.Column >
                {review.reviewDetails}
              </Grid.Column>
            </Grid.Row>
            </Grid>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
