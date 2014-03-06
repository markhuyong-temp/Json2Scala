package code.snippet

import net.liftweb.util.Helpers._
import net.liftweb.http.SHtml._
import net.liftweb.http.js.JsCmds._
import java.util.Date
import comet.{Message, ChatServer}

object ChatFrontend {

  def render = {
    val userName = "Mister X"
    "#inp_chat" #> onSubmit(s => {
      if (s.trim.nonEmpty) {
        ChatServer ! Message(new Date(), userName, s.trim) // send the message to the comet server
      }
      SetValById("inp_chat", "") // clear the input box
    })
  }
}