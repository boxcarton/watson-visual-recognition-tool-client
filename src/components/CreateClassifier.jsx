import React from 'react'
import Radium from 'radium'
import ReactDOM from 'react-dom'
import {browserHistory} from 'react-router'
import request from 'superagent'
import Styles from './Styles'
import TitleCard from './TitleCard'
import Button from './Button'
import Class from './Class'
import ProgressModal from './ProgressModal'
import StackGrid from 'react-stack-grid';

var myNum = 2

@Radium
export default class CreateClassifier extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            classifierName: '',
            classes: [
                {negative: true, file: null, id: 0},
                {name: '', file: null, id: 1},
            ],
            errors: false,
            upload: false,
        }
    }

    onTextChange = (text) => {
        this.setState({ classifierName: text.target.value })
    }

    setClassFile = (file, key) => {
        var newClasses = $.extend([], this.state.classes)
        newClasses[key].file = file
        this.setState({ classes: newClasses })
    }

    setClassName = (text, key) => {
        var newClasses = $.extend([], this.state.classes)
        newClasses[key].name = text.target.value
        this.setState({ classes: newClasses })
    }

    deleteClass = (key) => {
        var newClasses = $.extend([], this.state.classes)
        newClasses.splice(key, 1)
        this.setState({classes: newClasses})
    }

    cancel = () => {
        browserHistory.push('/')
    }

    errorCheck = () => {
        var self = this
        self.setState({errors: false}, function() {
            var errors = this.state.errors
            if (this.state.classifierName == null || this.state.classifierName == '') {
                errors = true
                self.setState({errors: errors})
                return
            }

            var validClasses = 0

            // State takes time, so we can just take a tally here
            this.state.classes.map(function(c) {
                if (c.negative) {
                     if (c.file != null) {
                         validClasses++
                     }
                     return
                }
                if (c.name == null || c.name == '') {
                    errors = true
                    self.setState({errors: errors})
                    return
                }
                if (c.file == null) {
                    errors = true
                    self.setState({errors: errors})
                    return
                }
                validClasses++
            })

            console.log('valid: ' + validClasses)

            if (validClasses < 2) {
                errors = true
                self.setState({errors: errors})
                return
            }

            if (!errors) {
                self.setState({upload: true})
            }
        })
    }

    // This is kind of messy but helps show progress faster
    create = (onProgress, onFinished) => {
        var req = request.post('/api/create_classifier')
        var self = this

        this.state.classes.map(function(c) {
            if (c.file != null) {
                name = c.name
                if (c.negative) {
                    name = 'NEGATIVE_EXAMPLES'
                }
                req.attach('files', c.file[0], name)
            }
        })

        req.query({ api_key: localStorage.getItem('apiKey') })

        req.query({ name: this.state.classifierName })

        req.on('progress', function(e) {
            if (e.direction == 'upload') {
                console.log(e.percent)
                onProgress(e.percent)
            }
        })

        req.then(function(res, err) {
            console.log(res)
            onFinished()
            self.setState({upload: false})
            browserHistory.push('/')
        })
    }

    addClass = (e) => {
      var newClasses = $.extend([], this.state.classes)
      newClasses.push({
        name: "",
        file: null,
        id: myNum
      })
      myNum++
      this.setState({classes: newClasses})
    }

    render() {
        var textStyles = {
            base: {
                color: Styles.colorTextLight,
                font: Styles.fontDefault,
            },
            header: {
                color: Styles.colorTextDark,
                font: Styles.fontHeader,
            }
        }

        var margin = {
            marginTop: '5px',
        }

        const RGB=Styles.colorPrimary
        const A='0.1'
        const RGBA='rgba('+parseInt(RGB.substring(1,3),16)+','+parseInt(RGB.substring(3,5),16)+','+parseInt(RGB.substring(5,7),16)+','+A+')'
        const A2='0.3'
        const RGBA2='rgba('+parseInt(RGB.substring(1,3),16)+','+parseInt(RGB.substring(3,5),16)+','+parseInt(RGB.substring(5,7),16)+','+A2+')'

        var self = this
        return (
            <div>
                <div style={[textStyles.header, {marginTop: '30px', marginBottom: '5px'}]}>
                    Create a new classifier
                </div>
                <div style={[textStyles.base, {marginTop: '5px', marginBottom: '18px'}]}>
                    A classifier is a group of classes that are trained against each other. This allows you identify highly specialized subjects.
                </div>

                <TitleCard
                    errors={self.state.errors}
                    placeholder='Classifier name'
                    title={self.state.classifierName}
                    onChange={this.onTextChange}
                    inputStyle={textStyles.header}>
                    <div style={{display: 'inline-block', backgroundColor: RGBA, borderRadius: '5px', borderColor: RGBA2, borderWidth: 'thin', borderStyle: 'solid', padding: '10px', paddingLeft: '10px', paddingRight: '20px', margin: '10px', marginBottom: '30px'}}>
                        <div style={[textStyles.base, {color: Styles.colorTextDark, marginTop: '0px', marginBottom: '0px'}]}>
                            <b>Requirements:</b>
                        </div>
                        <div style={[textStyles.base, {marginTop: '5px', marginLeft: '-15px', marginBottom: '-5px'}]}>
                            <ul style={{listStyleType: 'circle'}}>
                                <li>You need a minimum of 2 classes</li>
                                <li style={{marginTop: '5px'}}>Classes require at least 10 images</li>
                            </ul>
                        </div>
                    </div>
                    <div style={[textStyles.header, {margin: '10px', marginTop: '0px', marginBottom: '5px'}]}>
                        Classes
                    </div>
                    <StackGrid columnWidth={292} gutterWidth={40} style={{marginTop: '10px'}}>{this.state.classes.map(function(c, i) {
                        return (
                            <Class
                                errors={self.state.errors}
                                negative={c.negative}
                                title={c.name}
                                style={{maxWidth:'30rem'}}
                                key={c.id}
                                id={i}
                                setClassFile={self.setClassFile}
                                setClassName={self.setClassName}
                                delete={self.deleteClass}/>
                        )
                    })}</StackGrid>
                    <div style={{textAlign: 'right'}}>
                        <Button onClick={this.addClass} text='Add class' style={{float: 'left'}}/>
                        <Button onClick={this.cancel} text='Cancel' style={{marginRight: '20px'}}/>
                        <Button onClick={this.errorCheck} text='Create' kind='bold'/>
                    </div>
                </TitleCard>
                {this.state.upload ?
                    <ProgressModal
                        load={this.create}/>
                    : null
                }
            </div>
        )
    }
}
