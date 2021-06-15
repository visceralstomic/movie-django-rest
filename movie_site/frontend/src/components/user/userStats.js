import React, {Component} from "react";
import {UserFunc} from "../../service/serviceFunc";
import {VictoryPie, VictoryChart, VictoryLine, VictoryLabel, 
    VictoryAxis, VictoryTooltip, VictoryBar, VictoryVoronoiContainer} from "victory";
import { Container, Row, Col, Jumbotron } from 'reactstrap';



export default class UserStats extends Component {
    constructor(props){
        super(props);
        this.uservice = new UserFunc();
        this.state = {
            mostRtdYr: [],
            hgstRtdYr: [],
            numOfRating: [],
            avgPerGnr: [],
            calcStats: null,
        }
        this.lineTheme = {
            line: {
                style: {
                    labels: { fontSize: 5}
                }
            }
        }        
    }

    componentDidMount(){
        this.uservice.getUserStats().then(data => {
            this.setState({calcStats: data.num_of_watched >= 5})
        }).catch(error => {
            console.log(error)
        })
        this.uservice.getRatingStats().then(data => {
            let {mostRtdYr, hgstRtdYr, numOfRating, avgPerGnr} = data;
            mostRtdYr = mostRtdYr.map(elem => 
                ({x: new Date(elem.year,0).getFullYear().toString(), y: elem.year__count}))
            hgstRtdYr = hgstRtdYr.map(elem => 
                ({x: new Date(elem.year,0).getFullYear().toString(), y: elem.mark__avg}))
            this.setState({mostRtdYr, hgstRtdYr, numOfRating, avgPerGnr});
        }).catch(error => {
            console.log(error)
        })
    } 

    render() {
        const  {mostRtdYr, hgstRtdYr, numOfRating, avgPerGnr, calcStats} = this.state;
        
        return (
            <>
            {calcStats ?
                <Container>

                <Row>
                    <Col>
                            <VictoryChart>
                            <VictoryLabel 
                                text="Higest rated year"
                                x={100}
                                y={40}
                                style={{
                                    fontSize: 18
                                }}                    
                            />

                            <VictoryAxis
                                label="Year"
                                style={{ tickLabels: { fontSize: 10 } }}
                            />
                            <VictoryAxis
                                label="Rating" 
                                dependentAxis
                                style={{ 
                                    tickLabels: { fontSize: 10 },
                                    axisLabel: { padding: 35} 
                                }}
                            />
                    
                            <VictoryLine
                                
                                style={{
                                    data: { 
                                        strokeWidth: 3,
                                        stroke: "#c43a31" 
                                    },
                                }}
                                data={hgstRtdYr}                    
                            />
                            </VictoryChart>
                    </Col>

                    <Col>
                        <VictoryChart
                        domainPadding={20}
                        containerComponent={<VictoryVoronoiContainer
                            labels={
                                ({datum}) => `${datum.x}: ${datum.y}`
                            }
                            labelComponent={
                                <VictoryTooltip 
                                    flyoutWidth={70}
                                    flyoutHeight={22}
                                />
                            }
                        />}
                        >
                        <VictoryLabel 
                            text="Most rated year"
                            x={100}
                            y={40}
                            style={{
                                fontSize: 18
                            }}                   
                        />
                    
                        <VictoryBar
                            data={mostRtdYr}
                            style={{ 
                                labels: { fontSize: 14 }
                            }}
                        />

                        <VictoryAxis 
                            label="Year"
                            style={{ 
                                tickLabels: { fontSize: 10 }
                            }}
                        />
                        <VictoryAxis
                            label="Quantity of ratings" 
                            dependentAxis
                            style={{ 
                                tickLabels: { fontSize: 10 },
                                axisLabel: { padding: 35} 
                            }}
                        />

                        </VictoryChart>                            
                    </Col>

                </Row>

                <Row>
                    <Col>
                        <VictoryChart
                        domainPadding={20}
                        containerComponent={
                            <VictoryVoronoiContainer 
                                labels={
                                    ({datum}) => `${datum.movie__genres__name}: ${datum.avg_mark}`
                                }
                                labelComponent={
                                    <VictoryTooltip 
                                        flyoutWidth={105}
                                        flyoutHeight={22}
                                    />
                                }
                            />
                        }
                        >
                        <VictoryLabel 
                            text="Average rating per genre"
                            x={100}
                            y={40}
                            style={{
                                fontSize: 18
                            }}                    
                        />
                        
                        <VictoryAxis
                            label="Genres"
                            style={{
                                tickLabels: {
                                    fontSize: 10,
                                    angle: 75,
                                    padding: 20,
                                },
                                axisLabel: {
                                    fontSize: 14,
                                    padding: 35
                                }
                            }}
                        />

                        <VictoryAxis
                            dependentAxis
                            label="Average rating"
                            style={{
                                tickLabels: {fontSize: 10},
                                axisLabel: {fontSize: 14}
                            }}
                        />

                        <VictoryBar 
                            data={avgPerGnr}
                            x="movie__genres__name"
                            y="avg_mark"
                            style={{
                                labels: {
                                    fontSize: 14
                                }
                            }}
                        />
                        </VictoryChart>                    
                    </Col>

                    <Col>
                        <VictoryPie 
                        data={numOfRating}
                        x="mark"
                        y="mark__count"
                        labels={({datum})=>`${datum.mark} (${datum.mark__count})`}
                        labelRadius={({ innerRadius }) => innerRadius + 85 }
                        style={{ 
                            labels: { 
                                fill: "white", 
                                fontSize: 15 
                            } 
                        }}
                        />                    
                    </Col>
                </Row>               
                    
            </Container>
        :<Jumbotron>
            <Container>
                <h4> Not enough data to make statistic</h4>
            </Container>
         </Jumbotron>}
            </>
        )
    }
}