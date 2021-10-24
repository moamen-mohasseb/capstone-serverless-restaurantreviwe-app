import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Label
} from 'semantic-ui-react'

import { createreview, deletereview, getreviews } from '../api/reviews-api'
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
      const newreview = await createreview(this.props.auth.getIdToken(), {
        name: this.state.newreviewName ,
        reviewDetails:this.state.newReviewDetails,
        reviewDegree:this.state.newReviewDegree,
        reviewDate: dateFormat(new Date(), 'yyyy-mm-dd') as string 
      })
      this.setState({
        reviews: [...this.state.reviews, newreview],
        newreviewName: ''
      })}
      else{alert('Enter name')}}
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
        <Label size="large">Review Degree...</Label>
        <Input
            
            actionPosition="left"
            placeholder="From 1 to 5 Stars  "
           // value="0"
            onChange={this.handleReviewDegreeChange}
          />       
          </Grid.Column>
          <Grid.Column width={10}>
          <Divider />
        </Grid.Column>
        <Grid.Column width={10}>
          <Label size="large">Review Details...</Label>
        <Input
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
      <Grid key={Math.random()} padded>
        {this.state.reviews.map((review, pos) => {
          return (
            <Grid  key={review.reviewId} padded>
            <Grid.Row width={25}>
             
              <Grid.Column width={10} verticalAlign="middle">
                <Label size="big">{review.name}</Label>
            
                {Array(review.reviewDegree).fill(1,0,Number(review.reviewDegree)).map(()=>{
                  return(
                    
                    <Icon  key={Math.random()} name="star"/>
                    
                )
                })}
               
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {review.reviewDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right" verticalAlign="middle">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(review.reviewId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right" verticalAlign="middle">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onreviewDelete(review.reviewId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
             
            </Grid.Row>
            <Grid.Row width={20}>
              <Grid.Column floated='right' verticalAlign="top" width={16}>
              { review.attachmentUrl && (
                <Image src={review.attachmentUrl} size="small" wrapped />
              )}
              </Grid.Column>
              </Grid.Row>
              <Grid.Row>
              <Grid.Column width={16}>
               <Label basic size="large" active> {review.reviewDetails}</Label>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row width={20}>
            <Grid.Column>
          <Divider />
        </Grid.Column>
            </Grid.Row>
            </Grid>
          )
        })}
      </Grid>
    )
  }

  
}
