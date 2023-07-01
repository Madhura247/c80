import React, { Component } from 'react';
import { Text, View, Alert } from 'react-native';
import axios from "axios";
import { ImageBackground } from 'react-native-web';

export default class MeteorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meteors: {},
        };
    }

    componentDidMount() {
        this.getMeteors()
    }

    getMeteors = () => {
        axios
            .get("https://api.nasa.gov/neo/rest/v1/feed?api_key=nAkq24DJ2dHxzqXyzfdreTvczCVOnwJuFLFq4bDZ")
            .then(response => {
                this.setState({ meteors: response.data.near_earth_objects })
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }

    renderItem = ({item}) => {
        let meteor = item;
        let bg_img, speed, size;
        if (meteor.threat_score<=30) {
            bg_img = require("../assets/meteor_bg1.png");
            speed = require("../assets/meteor_speed1.gif");
            size = 100
        } else if (meteor.threat_score<=75) {
            bg_img = require("../assets/meteor_bg2.png");
            speed = require("../assets/meteor_speed2.gif");
            size = 150
        } else {
            bg_img = require("../assets/meteor_bg3.png");
            speed = require("../assets/meteor_speed3.gif");
            size = 200
        } 
        return(
            <View> 
                <ImageBackground source = {bg_img} style = {styles.backgroundImage}>
                    <View> 
                        <Text style = {styles.cardTitle}>  </Text>
                    </View>
                </ImageBackground>
            </View>
        ) 
    }

    render() {
        if (Object.keys(this.state.meteors).length === 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Text>Loading</Text>
                </View>
            )
        } else {
            let meteor_arr = Object.keys(this.state.meteors).map(meteor_date => {
                return this.state.meteors[meteor_date]
            })
            let meteors = [].concat.apply([], meteor_arr);

            meteors.forEach(function (element) {
                let diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + 
                    element.estimated_diameter.kilometers.estimated_diameter_max) / 2;
                let threatScore = (diameter / element.close_approach_data[0].miss_distance.kilometers) * 1000000000;
                element.threat_score = threatScore;
            });

            meteors.sort(function(a,b){
                return b.threat_score - a.threat_score;
            })

            meteors = meteors.slice(0,5);

            return (
                <View
                    style={styles.container}>
                    <SafeAreaView style = {styles.droidSafeArea}></SafeAreaView>
                    <Flatlist 
                        keyExtractor = {this.keyExtractor}
                        data = {meteors}
                        renderItem = {this.renderItem}
                        horizontal = {true}
                    > </Flatlist>
                    <Text>Meteor Screen!</Text>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    titleBar: {
        flex: 0.15,
        justifyContent: "center",
        alignItems: "center"
    },
    titleText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white"
    },
    meteorContainer: {
        flex: 0.85
    },
    listContainer: {
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        justifyContent: "center",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        borderRadius: 10,
        padding: 10
    },
    cardTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: "bold",
        color: "white"
    },
    cardText: {
        color: "white"
    },
    threatDetector: {
        height: 10,
        marginBottom: 10
    },
    gifContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    meteorDataContainer: {
        justifyContent: "center",
        alignItems: "center",

    }
});