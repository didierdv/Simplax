# Simple Parallax with Simplax
## Documentation

Simplax is a jQuery plugin that enhance your pages providing them with two simple parallax effects.

The two effect are:

* the **classic** parallax animation which can deal with CSS `background-position` and positioned elements values (`top`, `bottom`, `left` and `right`),
* the **boogie** animation which animates the CSS `background-position` value of an element depending on the cursor moving.

### How does it work?

You can set the plugin properties in two ways.

* In your JS code using:
`$('.target-1, .target-2, .target-N').simplax({'effect':'classic'})`
* Directy in the HTML markup using `data-simplax` attribute on the elements you want to animate. The value must be formatted as a JS object.
`<div data-simplax="{'effect':'classic','speed':0.5}"></div>`

Simplax offers you flexibility letting you combine these two ways.

	<!-- HTML -->
	<div class="smplx" data-simplax='{"speed":2}'> … </div>
	<div class="smplx" data-simplax='{"speed":0.5}'> … </div>
	
	// JS
	$('.smplx').simplax({
		'effect': 'classic',
		'offset': 50
	});
	
**Look out!** When using `data-simplax` attribute, make sure to surround your value with curly brackets. Also, your value is to be converted into a JSON objet which resorts to double quotation marks. Therefore, make use of single quotation marks to wrap your value and double *within* the oject.

 	<!-- BAD  -->
 	<div data-simplax="{'effect':'classic'}"> … </div>
  
 	<!-- GOOD  -->
 	<div data-simplax='{"effect":"classic"}'> … </div>

### Show me how to parallax

Here are Simplax properties and for each, a short description and possible values:

* `effect`
	* Effect wanted
	* ('`classic`|`boogie`')
* `offset`
	* Add top offset (pixels used).
	* Any negative or positive number *without unit*.
* `oppositeMoving` *(Boogie only)*
	* Moving is opposite to cursor moving.
	* (`true`|`false`)
* `animate`
	* CSS property to animate.
	* ('`background-position`|`top`|`bottom`|`left`|`right`')
* `speed` *(Classic only)*
	* Background moving speed compared to scrolling.
	* Any negative or positive number.
* `range` *(Boogie only)*
	* Moving amplitude.
	* Any positive number.

Depending on the effect you will use, only some properties are allowed. That said, defining properties that are not tied to an effect will not break down the script.

### Comptability

Simplax works in all modern browsers (IE9 included).
