import React from 'react'
import Radium from 'radium'
import Styles from './Styles'
import DropButton from './DropButton'

@Radium
export default class Class extends React.Component {
    onDrop = (file) => {
        this.props.setClassFile(file, this.props.id)
    }

    render() {
        return (
            <div>
                <input type="text"
                    placeholder='Class name' />
                <DropButton text='Drag .zip here to train class' subtext='choose your file' onDrop={this.onDrop}/>
            </div>
        )
    }
}
