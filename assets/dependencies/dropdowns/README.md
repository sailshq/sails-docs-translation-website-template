# Dropdowns

## `appendStdDropdown()`
Appends a dropdown to the specified container using the standard dropdown template.

#### Options:
| option  | type   | description | required? | defaults to |
|---------|--------|-------------|-----------|-------------|
| choices | array  | An array of dictionaries to use as the select options. | required  | |
| keyToDisplay | string | The property of the dictionaries in `choices` to use as display names for the select options. | required  | |
| containerSelector | string | The selector for the container to which the dropdown will be appended | required | |
| onRemove | function | A function to call when the dropdown is removed. Receives `metadata` as first argument. | | |
| iconClassKey | string | In order for the dropdown items to have icons, include this property in each dictionary of the `choices` array with the icon's class name as the value. (If not specified, they just won't be included.) | | |
| placeholder | string | The placeholder text to show when nothing has been selected. (If allowEmpty is true, will also be the empty choice.) | | `'--'` |
| selectedIndex | number | The index of the choice that is initally selected when the dropdown renders | | `0` |
| allowEmpty | boolean | If true, a special empty choice will be prepended before the other choices, allowing the user to make a null choice. | | `false` |



#### Returns:
String - The dom ID of the new dropdown

#### Example usage:
```javascript
// TEST DROPDOWN
var testDropdownId = appendStdDropdown({
  choices: [
    {
      id: 1,
      label: 'Brioche',
    },
    {
      id: 2,
      label: 'Kouign Amann',
    },
    {
      id: 3,
      label: 'Pain au Chocolat',
    },
    {
      id: 4,
      label: 'Palmier',
    }
  ],
  keyToDisplay: 'label',
  containerSelector: '[is="pastry-dropdown-container]',
  selectedIndex: 2,
  placeholderText: 'Choose a pastry.',
  allowEmpty: true
});
// Remember to save the DOM id of this dropdown to the parent component's `subComponentIds` array!
```
#### Styling the standard dropdown
> TODO: document classes

## `appendDropdown()`
Appends a custom dropdown within the specified container.

#### Options:
| option  | type   | description | required? | defaults to |
|---------|--------|-------------|-----------|-------------|
| choices | array  | An array of the dictionaries being used as the select options. | required  | |
| containerSelector | string | The selector for the container to which the dropdown will be appended. | required | |
| html | string | The base HTML template string for this component. | required | |
| choiceContainerSelector | string | The selector for the element in your template that will be hidden when the dropdown is closed. | required | |
| choiceSelector | string | The selector for the select option elements | required | |
| placeholderSelector | The selector for the dropdown's selected/placeholder text (the part that's visible when it's closed). If not specified, the dropdown won't update this when closed. | | |
| selectedIndex | number | The index of the choice that is initally selected when the dropdown renders | | `0` |
| onRemove | function | A function to call when the dropdown is removed. Receives `metadata` as first argument. | | |
| customEvents | array of dictionaries | Any extra events tied to this dropdown that aren't included in the default events. (e.g. if you want to update a placeholder icon/class/etc. on select, so we don't have to deal with updating aesthetic things about the dropdown in other files' events.) | |`[]`|

#### Returns:
String - The dom ID of the new dropdown

#### Example usage:
```javascript
var pastryChoices = [
  {
    id: 1,
    label: 'Brioche',
  },
  {
    id: 2,
    label: 'Kouign Amann',
  },
  {
    id: 3,
    label: 'Pain au Chocolat',
  },
  {
    id: 4,
    label: 'Palmier',
  }
];
// Append the dropdown.
var pastryDropdownId = appendDropdown({
  choices: pastryChoices,
  containerSelector: '[is="pastry-dropdown-container]',
  html: getTemplateFn({id: 'assets/templates/dropdowns/my-custom-pastry-dropdown.html'})({
    choices: pastryChoices
  }),
  choiceContainerSelector: '[is="pastry-options-container]',
  choiceSelector: '[is="choice"]'
});
// Remember to save the DOM id of this dropdown to the parent component's `subComponentIds` array!
```



## `getDropdownValue()`
Get the value (i.e. selected choice) of the dropdown with the specified DOM id.

#### Options:
| option  | type   | description | required? |
|---------|--------|-------------|-----------|
| domId   | string | The ID of the dropdown  | required  |

#### Returns:
Dictionary - the currently selected choice

## `setDropdownValue()`
Set the value (i.e. selected choice) of the dropdown with the specified DOM id. The choice at the specified index will be selected.

#### Options:
| option  | type   | description | required? |
|---------|--------|-------------|-----------|
| domId   | string | The ID of the dropdown  | required  |
| selectIndex  | number | The index of the choice within the dropdown's `choices` array that the dropdown's value is being set to | required |

## `disableDropdown()`
Render a dropdown un-openable, and close the dropdown if it's open.

#### Options:
| option  | type   | description | required? |
|---------|--------|-------------|-----------|
| domId   | string | The ID of the dropdown  | required  |


## `enableDropdown()`
Make a dropdown openable.

#### Options:
| option  | type   | description | required? |
|---------|--------|-------------|-----------|
| domId   | string | The ID of the dropdown  | required  |


## `dropdown:select` event

When a choice is selected, we fire a "dropdown:select" event.


#### Example usage:

```javascript
$('#some-parent-el-of-dropdown').on('dropdown:select', function (e, selectedChoice){
  console.log('You selected: ',selectedChoice);

  e.stopPropagation();
});

$('body').on('dropdown:select', function (e, selectedChoice){
  // This will not fire if the dropdown is inside "#some-parent-el-of-dropdown"
});
```
