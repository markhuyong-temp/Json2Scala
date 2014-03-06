import code.util.FileHelper
import java.io.File
import net.liftweb.common.Loggable
import net.liftweb.json.JsonParser
import org.apache.commons.io.FileUtils
import org.jsoup.Jsoup
import org.jsoup.select.Elements
import scala.util.matching.Regex

/**
 * Created by mark on 3/3/14.
 */

object runner extends App with FileHelper with Loggable {
  //http://api.pengyou.com/json.php?cb=__i_6&mod=school&act=selector&schooltype=3&country=0&province=31&g_tk=748662657

  val country_snippet =
    """
      |<select name="select" id="state" onchange="SchoolSelectFrame.change_state()" style="">
      |    <option selected="" value="0">中国</option>
      |    <option value="36">澳大利亚</option>
      |    <option value="124">加拿大</option>
      |    <option value="208">丹麦</option>
      |    <option value="372">爱尔兰</option>
      |    <option value="458">马来西亚</option>
      |    <option value="528">荷兰</option>
      |    <option value="554">新西兰</option>
      |    <option value="578">挪威</option>
      |    <option value="608">菲律宾</option>
      |    <option value="702">新加坡</option>
      |    <option value="710">南非</option>
      |    <option value="764">泰国</option>
      |    <option value="826">英国</option>
      |    <option value="840">美国</option>
      |</select>
    """.stripMargin

  val province_snippet =
    """
      |<select id="province" style="width:105px;" onchange="SchoolSelectFrame.change_province()">
      |    <option value="11">北京</option>
      |    <option value="12">天津</option>
      |    <option value="13">河北</option>
      |    <option value="14">山西</option>
      |    <option value="15">内蒙古</option>
      |    <option value="21">辽宁</option>
      |    <option value="22">吉林</option>
      |    <option value="23">黑龙江</option>
      |    <option value="31">上海</option>
      |    <option value="32">江苏</option>
      |    <option value="33">浙江</option>
      |    <option value="34">安徽</option>
      |    <option value="35">福建</option>
      |    <option value="36">江西</option>
      |    <option value="37">山东</option>
      |    <option value="41">河南</option>
      |    <option value="42">湖北</option>
      |    <option value="43">湖南</option>
      |    <option value="44">广东</option>
      |    <option value="45">广西</option>
      |    <option value="46">海南</option>
      |    <option value="50">重庆</option>
      |    <option value="51">四川</option>
      |    <option value="52">贵州</option>
      |    <option value="53">云南</option>
      |    <option value="54">西藏</option>
      |    <option value="61">陕西</option>
      |    <option value="62">甘肃</option>
      |    <option value="63">青海</option>
      |    <option value="64">宁夏</option>
      |    <option value="65">新疆</option>
      |    <option value="71">台湾</option>
      |    <option value="81">香港</option>
      |    <option value="82">澳门</option>
      |</select>
    """.stripMargin

  val outfileName = "./pengyou.txt"
  val tupleStr = new StringBuffer()
  val country_parser = Jsoup.parse(country_snippet)
  logger.debug(s"country_parser:${country_parser}")

  //  val value = country_parser.select("#state > option:contains(\"澳大利亚\")")
  val value = country_parser.select("#state > option:contains(" + "澳大利亚" + ")").`val`()

  logger.debug(s"country_parser value :${value}")

  val province_parser = Jsoup.parse(province_snippet)
  logger.debug(s"province_parser:${province_parser}")

  val provinces = province_parser.select("#province >option").iterator()

  while (provinces.hasNext) {
    val pro = provinces.next().`val`()
    getPairs(pro)
  }

  FileUtils.write(getFile(outfileName), tupleStr.toString(), "UTF-8")

  def getPairs(province_code: String): Any = {
    val pattern = new Regex( """(\{.*\})""", "result")
    val url = """http://api.pengyou.com/json.php?cb=__i_6&mod=school&act=selector&schooltype=3&country=0&province=""" + province_code + """ & g_tk = 748662657 """
    val test = JsonParser.parse {
      val re = Jsoup.connect(url).timeout(1000).ignoreContentType(true).execute().body()
      //          .getElementsByTag("body").text
      val p = pattern.findFirstMatchIn(re).get.group("result")
      logger.debug(s"result:${p}")
      p
    }

    val regex = new Regex( """choose_school(\(.*\))""", "result")

    val school = (test \\ "result").values.toString
    val res: Elements = Jsoup.parse(school).select("a[href]")

    val resa = res.iterator()
    while (resa.hasNext) {
      val text = resa.next().toString
      val els = regex.findFirstMatchIn(text).get.group("result")
      tupleStr.append(els).append("\n")
      logger.debug("els:" + els)
    }
  }
}
