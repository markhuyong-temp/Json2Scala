organization := "com.markhuyong"

name := "Json parse to Scala"

scalaVersion := "2.10.3"


scalacOptions ++= Seq("-unchecked", "-deprecation", "-feature")

resolvers ++= Seq("snapshots" at "http://oss.sonatype.org/content/repositories/snapshots",
  "releases" at "http://oss.sonatype.org/content/repositories/releases"
)

seq(com.earldouglas.xsbtwebplugin.WebPlugin.webSettings: _*)

unmanagedResourceDirectories in Test <+= (baseDirectory) {
  _ / "src/main/webapp"
}


libraryDependencies ++= {
  val liftVersion = "2.6-M1"
  val rogueversion = "2.2.0"
  Seq(
    "net.liftweb" %% "lift-webkit" % liftVersion % "compile",
    "net.liftweb" %% "lift-mongodb" % liftVersion % "compile",
    "net.liftweb" %% "lift-mongodb-record" % liftVersion % "compile",
    "net.liftweb" %% "lift-mapper" % liftVersion % "compile",
    "net.liftweb" %% "lift-wizard" % liftVersion % "compile",
    "com.foursquare" %% "rogue-field" % rogueversion intransitive(),
    "com.foursquare" %% "rogue-core" % rogueversion intransitive(),
    "com.foursquare" %% "rogue-lift" % rogueversion intransitive(),
    "com.foursquare" %% "rogue-index" % rogueversion intransitive(),
    "org.mongodb" % "mongo-java-driver" % "2.9.3",
    "net.liftmodules" %% "lift-jquery-module_2.5" % "2.4",
    "org.eclipse.jetty" % "jetty-webapp" % "8.1.7.v20120910" % "container,test",
    "org.eclipse.jetty.orbit" % "javax.servlet" % "3.0.0.v201112011016" % "container,test" artifacts Artifact("javax.servlet", "jar", "jar"),
    "ch.qos.logback" % "logback-classic" % "1.0.6",
    "org.specs2" %% "specs2" % "1.14" % "test",
    "commons-io" % "commons-io" % "2.3",
    "org.jsoup" % "jsoup" % "1.7.3",
    "junit" % "junit" % "4.8.2" % "test"
  )
}

