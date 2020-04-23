from api.labels.input_object import LabelInputObject
from api.labels.models import Label


def has_label_with_label_text(text: str) -> bool:
    unique_label = text.lower()
    return Label.objects.filter(unique_label=unique_label).exists()


def get_label_with_text(text: str) -> Label:
    unique_label = text.lower()
    return Label.objects.get(unique_label=unique_label)


def get_all_labels():
    return Label.objects.all()


def create_label(label: LabelInputObject) -> Label:
    if has_label_with_label_text(label.label):
        return get_label_with_text(label.label)
    else:
        label.description = label.description if label.description else ""
        new_db_label = Label(unique_label=label.label.lower(),
                             label=label.label, description=label.description)
        new_db_label.save()
        return new_db_label
