package code.util

import java.io.File
import scala.collection.generic.CanBuildFrom

/**
 * Created by mark on 3/4/14.
 */

trait FileHelper {

  // standard using block definition
  def using[X <: {def close()}, A](resource: X)(f: X => A) = {
    try {
      f(resource)
    } finally {
      resource.close()
    }
  }

  /**
   * getFile with filename, if file doNot exist, create new one
   */
  def getFile(filename: String): File = {
    val file = new File(s"$filename")
    if (!file.exists()) file.createNewFile()
    file
  }
}

trait CollectionHelper {
  def partition[X, A, B, CC[X] <: Traversable[X], To, To2](xs: CC[X])(f: X => Either[A, B])(
    implicit cbf1: CanBuildFrom[CC[X], A, To], cbf2: CanBuildFrom[CC[X], B, To2]): (To, To2) = {
    val left = cbf1()
    val right = cbf2()
    xs.foreach(f(_).fold(left +=, right +=))
    (left.result(), right.result())
  }
}
