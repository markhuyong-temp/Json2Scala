package bootstrap.liftweb

import net.liftweb._
import util._
import Helpers._
import common._
import http._
import sitemap._
import Loc._
import code.model._
import net.liftweb.mongodb.MongoDB
import net.liftweb.mongodb.DefaultMongoIdentifier
import net.liftweb.mongodb.MongoAddress
import net.liftweb.mongodb.MongoSet
import com.mongodb.ServerAddress
import com.mongodb.MongoOptions
import com.mongodb.Mongo
import com.mongodb.DBAddress

/**
 * A class that's instantiated early and run.  It allows the application
 * to modify lift's environment
 */
class Boot {

  import BootHelpers._

  def boot {

    // where to search snippet
    LiftRules.addToPackages("code")

    // Build SiteMap
    def sitemap = SiteMap(
      Menu.i("Home") / "index"  >> LocGroup("main"), // the simple way to declare a menu

      Menu("Static", "Static Content") / "static" / ** >> LocGroup("main") >> loggedIn,

      Menu.i("Rogue Examples") / "examples" / "rogue"  >> LocGroup("examples") >> loggedIn,
      
      Menu.i("14 - Comet Chat") / "examples" / "task14" / "comet"  >> LocGroup("examples")

    )

//    def sitemapMutators =

    // set the sitemap.  Note if you don't want access control for
    // each page, just comment this line out.
    LiftRules.setSiteMapFunc(sitemap _)

    // Use jQuery 1.4
    LiftRules.jsArtifacts = net.liftweb.http.js.jquery.JQuery14Artifacts

    //Show the spinny image when an Ajax call starts
    LiftRules.ajaxStart =
      Full(() => LiftRules.jsArtifacts.show("ajax-loader").cmd)

    // Make the spinny image go away when it ends
    LiftRules.ajaxEnd =
      Full(() => LiftRules.jsArtifacts.hide("ajax-loader").cmd)

    // Force the request to be UTF-8
    LiftRules.early.append(_.setCharacterEncoding("UTF-8"))

    // What is the function to test if a user is logged in?
    LiftRules.loggedInTest = Full(() => true)

    // Use HTML5 for rendering
    LiftRules.htmlProperties.default.set((r: Req) =>
      new Html5Properties(r.userAgent))

  }

  // The simple way
  //MongoDB.defineDb(DefaultMongoIdentifier, new Mongo, "packt")

  /*
   * Thorough way
   * First checks for existence of mongo.default.url. If not found, then
   * checks for mongo.default.host, port, and name. Uses defaults if those
   * are not found.
   * Format of mongo.default.url is [host][:post][/]name
   */
   val defaultDbAddress = Props.get("mongo.default.url")
       .map(url => new DBAddress(url))
       .openOr(new DBAddress(
         Props.get("mongo.default.host", "127.0.0.1"),
         Props.getInt("mongo.default.port", 27017),
         Props.get("mongo.default.name", "packt")
       ))

  /*
   * If mongo.default.user, and mongo.default.pwd are defined, configure Mongo using authentication.
   */
   (Props.get("mongo.default.user"), Props.get("mongo.default.pwd")) match {
    case (Full(user), Full(pwd)) =>
      MongoDB.defineDbAuth(DefaultMongoIdentifier, new Mongo(defaultDbAddress), defaultDbAddress.getDBName, user, pwd)
      println("MongoDB inited using authentication: %s".format(defaultDbAddress.toString))
    case _ =>
      MongoDB.defineDb(DefaultMongoIdentifier, new Mongo(defaultDbAddress), defaultDbAddress.getDBName)
      println("MongoDB inited: %s".format(defaultDbAddress.toString))
   }


}

object BootHelpers {

  // A Loc function making sure only logged in users see the menu item
  val loggedIn = If(() => true, () => RedirectResponse("/user_mgt/login"))

}
