import { describe, it, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import Block from '@/modules/block';

const TEMPLATE = `<div class="root">{{{child}}}</div>`;
const WRAPPER = { classes: ['a', 'b'], styles: ['color: red', 'gap: 4px'] };

class TestBlock extends Block {
  public render(): DocumentFragment {
    return this.compile(TEMPLATE, this.props);
  }
}

describe('Block', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('creates element with default tag and sets data-block-id on first render', () => {
    const block = new TestBlock();
    const el = block.getContent();

    expect(el.tagName, 'element tag should be DIV').to.equal('DIV');
    expect(el.getAttribute('data-block-id'), 'id should match block.id').to.equal(block.id);
  });

  it('setProps triggers FLOW_UPDATE and calls onUpdate when props changed', () => {
    const block = new TestBlock({ key: 'initial' });
    const renderSpy = sinon.spy(block, 'render');
    const onUpdateSpy = sinon.spy(block, 'onUpdate');

    block.setProps({ key: 'updated' });

    expect(renderSpy.callCount > 0, 'render should be called after changed props').to.equal(true);
    expect(onUpdateSpy.called, 'onUpdate should be called after changed props').to.equal(true);

    const [oldProps, newProps] = onUpdateSpy.firstCall.args;
    expect(oldProps.key, 'old props should be kept for onUpdate').to.equal('initial');
    expect(newProps.key, 'new props should contain updated value').to.equal('updated');
  });

  it('append child block into parent element', () => {
    class ChildBlock extends TestBlock {
      constructor() {
        super({ wrapperProps: { id: 'child-block' } });
      }
      public render(): DocumentFragment {
        return this.compile('', this.props);
      }
    }

    const child = new ChildBlock();
    const parent = new TestBlock({ child });

    const html = parent.getContent();

    expect(
      html.querySelector('#child-block'),
      'rendered child element with #child-block should exist'
    ).to.not.equal(null);
  });

  it('dispatchComponentDidMount propagates to children', () => {
    const child = new TestBlock();
    const parent = new TestBlock({ child });
    const parentOnMount = sinon.spy(parent, 'onMount');
    const childOnMount = sinon.spy(child, 'onMount');

    parent.dispatchComponentDidMount();

    expect(parentOnMount.calledOnce, 'parent onMount should be called once').to.equal(true);
    expect(childOnMount.calledOnce, 'child onMount should be called once').to.equal(true);
  });

  it('dispatchComponentDidUnmount calls onUnmount and removes element', () => {
    const parent = new TestBlock();
    const onUnmountSpy = sinon.spy(parent, 'onUnmount');
    const element = parent.getContent();
    document.body.appendChild(element);

    parent.dispatchComponentDidUnmount();

    expect(onUnmountSpy.calledOnce, 'onUnmount should be called once').to.equal(true);
    expect(document.body.contains(element), 'element should be removed from DOM').to.equal(false);
  });

  it('apply wrapperProps sets classes and styles', () => {
    const block = new TestBlock({ wrapperProps: WRAPPER });

    const element = block.getContent();

    expect(
      Array.from(element.classList),
      'element should include wrapper classes'
    ).to.include.members(WRAPPER.classes);
    expect(element.getAttribute('style'), 'element should include wrapper styles').to.include(
      'color: red'
    );
    expect(element.getAttribute('style'), 'element should include wrapper styles').to.include(
      'gap: 4px'
    );
  });

  it('show and hide toggle style.display', () => {
    const block = new TestBlock();
    const element = block.getContent();

    block.hide();

    expect(element.style.display, 'display should be "none" after hide()').to.equal('none');

    block.show();

    expect(element.style.display, 'display should be empty after show()').to.equal('');
  });
});
