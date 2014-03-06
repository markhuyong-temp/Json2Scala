package comet

import net.liftweb.actor.LiftActor
import net.liftweb.http.ListenerManager
import java.util.Date

/**
 * Per message we create a case class
 */
case class Message(time: Date, user: String, msg: String)

/**
 * A singleton Actor that is accessible by all clients.
 * Clients send messages here and the actor distributes them
 * to registered listeners (component ChatBrowserComponent)
 */
object ChatServer extends LiftActor with ListenerManager {

  /**
   * The server holds a list of all the messages shared
   * Thats a private list that no one else can access directly.
   */
  private var msgs = Vector[Message]()

  /**
   * This is called for instance when a comet listener is initialized,
   * so we send all current messages to it.
   */
  def createUpdate = msgs

  /**
   * This method is called when the server received a message.
   * We check it's of the right type, append it to our
   * saved list of messages and then send only the new message
   * to the listeners.
   */
  override def lowPriority = {
    case m: Message => msgs :+= m; updateListeners(m)
  }
}