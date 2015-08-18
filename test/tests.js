QUnit.module("template-obj");


QUnit.test("should be parsed.", function(assert){

  // basic
  assert.deepEqual(
    // result
    templateObj({
      base   : "panel",
      heading: "${base}__heading",
      body   : "${base}__body",
      list   : "${base}__list",
      item   : "${list}__item",
      hoge   : "${fuga}"
    }),
    // expected
    {
      base   : "panel",
      heading: "panel__heading",
      body   : "panel__body",
      list   : "panel__list",
      item   : "panel__list__item",
      hoge   : "${fuga}"
    },
    "basic"
  );


  // nest
  assert.deepEqual(
    // result
    templateObj({
      ns: "app",
      range: {
        min: 50,
        max: 1200
      },
      events: {
        click     : "click.${ns}",
        mouseenter: "mouseenter.${ns}",
        mouseleave: "mouseleave.${ns}"
      },
      logs: {
        click     : "${events.click} was triggered.",
        mouseenter: "${events.mouseenter} was triggered.",
        mouseleave: "${events.mouseleave} was triggered.",
        range     : "${range.min} - ${range.max}"
      },
      defaultEvent: "${events.click}",
      values: [
        "value1",
        "value2",
        "value3"
      ],
      nestValues: [
        ["innerValue"]
      ],
      sample: "${events.hoge}",
      array: "values[0] == ${values[0]}, nestValues[0][0] == ${nestValues[0][0]}"
    }),
    // expected
    {
      ns: "app",
      range: {
        min: 50,
        max: 1200
      },
      events: {
        click     : "click.app",
        mouseenter: "mouseenter.app",
        mouseleave: "mouseleave.app"
      },
      logs: {
        click     : "click.app was triggered.",
        mouseenter: "mouseenter.app was triggered.",
        mouseleave: "mouseleave.app was triggered.",
        range     : "50 - 1200"
      },
      defaultEvent: "click.app",
      values: [
        "value1",
        "value2",
        "value3"
      ],
      nestValues: [
        ["innerValue"]
      ],
      sample: "${events.hoge}",
      array: "values[0] == value1, nestValues[0][0] == innerValue"
    },
    "nest"
  );


  // more nest
  assert.deepEqual(
    // result
    templateObj({
      obj: {
        obj: {
          obj: {
            obj: [
              "value!!"
            ]
          }
        }
      },
      array: [
        "dummy",
        [
          "dummy",
          "dummy",
          {
            key: ["array value!!"]
          }
        ]
      ],
      result: "${obj.obj.obj.obj[0]}, ${array[1][2].key[0]}"
    }),
    // expected
    {
      obj: {
        obj: {
          obj: {
            obj: [
              "value!!"
            ]
          }
        }
      },
      array: [
        "dummy",
        [
          "dummy",
          "dummy",
          {
            key: ["array value!!"]
          }
        ]
      ],
      result: "value!!, array value!!"
    },
    "more nest"
  );
});