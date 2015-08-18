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
      item   : "${list}__item"
    }),
    // expected
    {
      base   : "panel",
      heading: "panel__heading",
      body   : "panel__body",
      list   : "panel__list",
      item   : "panel__list__item"
    },
    "basic"
  );

  // nest
  assert.deepEqual(
    // result
    templateObj({
      ns: "app",
      events: {
        click     : "click.${ns}",
        mouseenter: "mouseenter.${ns}",
        mouseleave: "mouseleave.${ns}"
      },
      logs: {
        click     : "${events.click} was triggered.",
        mouseenter: "${events.mouseenter} was triggered.",
        mouseleave: "${events.mouseleave} was triggered."
      },
      defaultEvent: "${events.click}"
    }),
    // expected
    {
      ns: "app",
      events: {
        click     : "click.app",
        mouseenter: "mouseenter.app",
        mouseleave: "mouseleave.app"
      },
      logs: {
        click     : "click.app was triggered.",
        mouseenter: "mouseenter.app was triggered.",
        mouseleave: "mouseleave.app was triggered."
      },
      defaultEvent: "click.app"
    },
    "nest"
  );
});