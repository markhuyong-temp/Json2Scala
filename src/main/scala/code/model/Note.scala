package code.model

import net.liftweb.mongodb.record.MongoMetaRecord
import net.liftweb.mongodb.record.MongoRecord
import net.liftweb.mongodb.record.field.ObjectIdPk
import net.liftweb.record.field.TextareaField
import net.liftweb.mongodb.record.field.DateField
import net.liftweb.mongodb.record.field.ObjectIdRefField
import net.liftweb.record.field.DateTimeField

object Note extends Note with MongoMetaRecord[Note]

class Note private () extends MongoRecord[Note] with ObjectIdPk[Note] {
  def meta = Note

  object userId extends ObjectIdRefField(this,Note)
  object date extends DateTimeField(this)
  object note extends TextareaField(this, 1000)

}
