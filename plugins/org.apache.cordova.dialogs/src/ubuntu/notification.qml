import QtQuick 2.0
import Ubuntu.Components.Popups 0.1
import Ubuntu.Components 0.1

Dialog {
    id: dialogue
    property string button1Text
    property string button2Text
    property string button3Text
    property bool promptVisible
    property string defaultPromptText
    TextInput {// FIXME: swith to TextField(TextField should support visible property)
        id: prompt
        color: "white"
        text: defaultPromptText
        visible: promptVisible
        focus: true
    }
    Button {
        text: button1Text
        color: "orange"
        onClicked: {
            root.exec("Notification", "notificationDialogButtonPressed", [1, prompt.text]);
            PopupUtils.close(dialogue)
        }
    }
    Button {
        text: button2Text
        visible: button2Text.length > 0
        color: "orange"
        onClicked: {
            root.exec("Notification", "notificationDialogButtonPressed", [2, prompt.text]);
            PopupUtils.close(dialogue)
        }
    }
    Button {
        text: button3Text
        visible: button3Text.length > 0
        onClicked: {
            root.exec("Notification", "notificationDialogButtonPressed", [3, prompt.text]);
            PopupUtils.close(dialogue)
        }
    }
}
