package comet

import net.liftweb.http.CometActor
import net.liftweb.http.CometListener
import net.liftweb.util.ClearClearable
import scala.xml.NodeSeq
import net.liftweb.http.js.JsCmd
import net.liftweb.http.js.JsCmds._
import net.liftweb.http.js.jquery.JqJsCmds._

/**
 * The comet chat component. This one is registered with the page and
 * will push content to it.
 */
class ChatBrowserComponent extends CometActor with CometListener {

  private var msgs: Vector[Message] = Vector() // private state

  println("INIT COMET COMPONENT")

  // register this component
  def registerWith = ChatServer

  // listen for messages
  override def lowPriority = {
    case m: Message => msgs :+= m; partialUpdate(appendMessage(m) & ScrollToBottom())
    case all: Vector[Message] =>  msgs = all; println("Received ALL Messages"); reRender()
  }

  def appendMessage(m: Message): JsCmd = AppendHtml("chat-msg-tbody", buildMessageHtml(m))

  def buildMessageHtml(m: Message): NodeSeq =
    <tr><td>{m.time.toLocaleString}</td><td>{m.user}</td><td>{m.msg}</td></tr>

  /*
   * render is called after a page refresh or when the comet actor is newly initialized.
   */
  def render = {
	println("CALLING RENDER")
    Script(SetHtml("chat-msg-tbody", msgs.flatMap(buildMessageHtml)) & ScrollToBottom())
  }

  /*
   * Scroll down to make the last message visible
   * Its an example how you can easily create your own JsCmds to encapsulate often used
   * functionality.
   */
  case class ScrollToBottom extends JsCmd {
    def toJsCmd = "$('#chat-msg-content').animate({scrollTop:$('#chat-msg-content')[0].scrollHeight}, 1000);"
  }

}