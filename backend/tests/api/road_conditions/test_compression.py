from django.test import TestCase

from api.road_conditions.compression import to_json_road_condition
from tests.api.folders.methods import create_folder_types, create_folders
from tests.api.instruments.methods import create_instrument_systems
from tests.api.road_conditions.methods import (
    create_road_condition_types,
    create_road_conditions,
    create_rc_to_rc,
    create_rc_to_rca,
)
from tests.api.road_conditions.road_condition_actions.methods import (
    create_road_condition_action_goals,
    create_road_condition_actions,
)
from tests.api.road_segments.methods import (
    create_road_segment_types,
    create_road_segments,
    create_rs_to_rc,
)
from tests.api.scenarios.methods import create_scenarios


class RoadConditionMethodsTest(TestCase):
    databases = "__all__"

    def setUp(self):
        self.condition_types = create_road_condition_types(
            ["Test-Type-1", "Test-Type-2", "Test-Type-3", "Test-Type-4", "Test-Type-5"]
        )
        self.conditions = create_road_conditions(
            [
                "Test-Condition-1",
                "Test-Condition-2",
                "Test-Condition-3",
                "Test-Condition-4",
                "Test-Condition-5",
            ],
            self.condition_types,
        )
        self.instrument_systems = create_instrument_systems(
            ["Test-Sys-1", "Test-Sys-2", "Test-Sys-3"]
        )
        self.rc_action_goals = create_road_condition_action_goals(
            ["Test-Goal-1", "Test-Goal-2", "Test-Goal-3"]
        )
        self.rc_actions = create_road_condition_actions(
            ["Test-RCA-1", "Test-RCA-2", "Test-RCA-3"],
            self.rc_action_goals,
            self.instrument_systems[0],
        )
        self.rs_types = create_road_segment_types(
            ["Test-Type-1", "Test-Type-2", "Test-Type-3"]
        )
        self.folder_types = create_folder_types(
            ["Test-Type-1", "Test-Type-2", "Test-Type-3"]
        )
        self.folders = create_folders(["Test-1", "Test-2", "Test-3"], self.folder_types)
        self.scenarios = create_scenarios(
            ["Test-Scenario-1", "Test-Scenario-2", "Test-Scenario-3"], self.folders
        )
        self.road_segments = create_road_segments(
            ["Test-Segment-1", "Test-Segment-2", "Test-Segment-3"],
            self.scenarios,
            self.rs_types,
        )

    def test_to_json_road_condition(self):
        condition = self.conditions[0]
        child = self.conditions[1]
        action = self.rc_actions[0]
        create_rc_to_rc([condition], [child])
        create_rc_to_rca([condition], [action])
        json = to_json_road_condition(condition)
        expected = (
            "{'name': '%s', 'time': {}, "
            "'value': '%s', "
            "'type': %s, "
            "'actions': [{'goal_type': %s, "
            "'instrument_system': %s, "
            "'action_name': '%s', "
            "'constraint': {}, "
            "'description': %s, "
            "'instrument_actions': []}], "
            "'road_conditions': [{'name': '%s', 'time': {}, "
            "'value': %s, "
            "'type': %s, "
            "'actions': [], "
            "'road_conditions': []}]}"
            % (
                condition.name,
                condition.value,
                condition.road_condition_type.id,
                action.road_condition_action_goal.id,
                action.instrument_system.id,
                action.action_name,
                action.description,
                child.name,
                child.value,
                child.road_condition_type.id,
            )
        )
        self.maxDiff = None
        self.assertEqual(str(json), expected)
