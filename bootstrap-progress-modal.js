/*
  jQuery widget for a Bootstrap progress modal (https://github.com/seanhuber/bootstrap-progress-modal)
  Version 0.0.3
*/
(function($) {
  $.widget( 'sh.progressModal' , {

    options: {
      remove_other_pqs: true,
      modal_class: 'p-queue',
      steps: {}
    },

    _buildStepTable: function() {
      var steps = this.options.steps;

      ret_html = "<table class='table p-steps'>";
      $.each( this._stepNums(), function( idx, step_num ) {
        ret_html += "\n<tr data-step-num='"+step_num+"'>"
        ret_html += '\n  <td>'+steps[step_num].label+'</td>'
        ret_html += "\n  <td class='confirm-minutes'><span class='status glyphicon glyphicon-option-horizontal'></span></td>"
        ret_html += '\n</tr>'
      });
      ret_html += '\n</table>'
      ret_html += "\n<div class='hault-wrapper' style='display: none;'></div>"
      return ret_html;
    },

    _close: function() {
      var that = this;
      setTimeout( function() {
        that.element.on('bootstrapmodalwidgethidden', function() {
          that._trigger('hidden');
        });
        that.element.bootstrapModalWidget( 'hide' );
        that.element.bootstrapModalWidget( 'setContent', that._buildStepTable() ); // reset step table
        delete that['current_step'];
      }, 500);
    },

    _create: function() {
      if ( this._stepNums().length == 0 ) {
        console.error('progressModal initialized without any steps defined.');
        return false;
      }

      if ( this.options.remove_other_pqs ) {
        $( '.' + this.options.modal_class ).remove();
      }

      var that = this;
      this.element.bootstrapModalWidget({
        closable: false,
        initial_content: that._buildStepTable(),
        modal_class: that.options.modal_class,
        shown: function() {
          that._startNextStep();
        }
      });
    },

    fail: function() {
      $('.'+this.options.modal_class+' .hault-wrapper').hide();

      var $status_glyph = $('.'+this.options.modal_class+" table.p-steps tr[data-step-num='"+this.current_step+"'] .status");
      $status_glyph.removeClass('glyphicon-option-horizontal glyphicon-hourglass glyphicon-warning-sign');
      $status_glyph.addClass('glyphicon-remove');

      this._close();
    },

    hault: function( hault_html ) {
      var $status_glyph = $('.'+this.options.modal_class+" table.p-steps tr[data-step-num='"+this.current_step+"'] .status");
      $status_glyph.removeClass('glyphicon-option-horizontal glyphicon-hourglass');
      $status_glyph.addClass('glyphicon-warning-sign');

      var $hault_wrapper = $('.'+this.options.modal_class+' .hault-wrapper');
      $hault_wrapper.html( hault_html );
      $hault_wrapper.show();
    },

    proceed: function() {
      $('.'+this.options.modal_class+' .hault-wrapper').hide();

      if ( this._nextStepNum() == -1 ) { // last step complete
        this._markCurrentStepComplete();
        this._close();
      } else {
        this._startNextStep();
      }
    },

    _markCurrentStepComplete: function() {
      var $status_glyph = $('.'+this.options.modal_class+" table.p-steps tr[data-step-num='"+this.current_step+"'] .status");
      $status_glyph.removeClass('glyphicon-option-horizontal glyphicon-warning-sign glyphicon-hourglass');
      $status_glyph.addClass('glyphicon-ok');
    },

    _nextStepNum: function() {
      var step_nums = this._stepNums();
      if ( !this.hasOwnProperty( 'current_step' ) ) {
        return step_nums[0];
      }
      var current_idx = step_nums.indexOf( this.current_step.toString() );
      if ( current_idx == step_nums.length - 1 ) {
        return -1; // currently on the last step
      }
      return step_nums[ current_idx + 1 ];
    },

    _startNextStep: function() {
      var next_step_num = this._nextStepNum();
      if ( next_step_num == -1 ) {
        console.error( 'progressModal._startNextStep() called, but there is no next step to process. current_step = ', this.current_step );
        return false;
      }
      if ( this.hasOwnProperty( 'current_step' ) ) this._markCurrentStepComplete();

      this.current_step = next_step_num;
      var next_step = this.options.steps[ next_step_num ];
      var $status_glyph = $('.'+this.options.modal_class+" table.p-steps tr[data-step-num='"+this.current_step+"'] .status");
      $status_glyph.removeClass('glyphicon-option-horizontal glyphicon-warning-sign');
      $status_glyph.addClass('glyphicon-hourglass');
      next_step.startFunction();
    },

    _stepNums: function() {
      return Object.keys( this.options.steps ).sort( function( x, y ) {
        return parseInt(x) - parseInt(y);
      });
    }
  });

  // TODO: remove this dependency
  $.widget( 'sh.bootstrapModalWidget' , {
    options: {
      add_click_handler: true,
      animate: true,
      closable: true,
      header:  false,
      // header: "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title' id='myModalLabel'>Modal title</h4>",
      initial_content: "<div style='text-align: center; padding: 100px;'><img src='/images/throb64.gif' /></div>",
      shown_content: false,
      footer: false,
      // footer: "<button type='button' class='btn btn-primary'>Save changes</button>",
      include_close_link: true,
      modal_class: 'none-set',
      show: false,
      // shown: function() { console.log('modal shown'); },
      width_size: 'medium' // possible values: 'small', 'medium', or 'large'
    },

    _create: function() {
      this.element.uniqueId();
      this.options.el_id = this.element.attr('id');

      var that = this;
      var $modal = this._createModal();

      if ( this.options.add_click_handler ) {
        this.element.click( function() {
          that.show();
          return false;
        });
      }

      if ( this.options.show )
        this.show();
    },

    _createModal: function() {
      size_class = '';
      if ( this.options.width_size == 'large' ) size_class = 'modal-lg';
      if ( this.options.width_size == 'small' ) size_class = 'modal-sm';

      var modal_classes = this.options.modal_class;
      if ( this.options.animate ) modal_classes += ' fade';
      var $modal = $("<div class='modal sr-modal "+modal_classes+"' data-el-id='"+this.options.el_id+"' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-dialog "+size_class+"'><div class='modal-content'></div></div></div>").appendTo('body');

      $modal_content = $modal.find('.modal-content');

      if ( this.options.header )
        $( "<div class='modal-header'>"+this.options.header+"</div>" ).appendTo( $modal_content );

      $modal_body = $("<div class='modal-body'>"+this.options.initial_content+"</div>").appendTo( $modal_content );

      if ( this.options.include_close_link )
        $("<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>").prependTo( $modal_body );

      if ( this.options.footer )
        $( "<div class='modal-footer'>"+this.options.footer+"</div>" ).appendTo( $modal_content );

      return $modal;
    },

    _getModal: function() {
      return $(".sr-modal[data-el-id='"+this.options.el_id+"']");
    },

    hide: function() {
      var $modal = this._getModal();
      $modal.off();
      var that = this;
      $modal.on('hidden.bs.modal', function() {
        that._trigger('hidden');
      });
      $modal.modal('hide');
    },

    scrollTop: function() {
      this._getModal().animate({scrollTop: 0}, 'fast');
    },

    setContent: function( content_html ) {
      if ( this.options.header ) {
        this._getModal().find('.modal-header').html( this.options.header );
      }

      $modal_content = this._getModal().find('.modal-content .modal-body');
      $modal_content.html( content_html );
    },

    show: function() {
      this.setContent( this.options.initial_content );
      var $modal = this._getModal();
      $modal.off();
      var that = this;
      if ( this.options.shown_content ) {
        $modal.on('shown.bs.modal', function() {
          that.setContent( that.options.shown_content );
          that._trigger('shown');
        });
      } else {
        $modal.on('shown.bs.modal', function() {
          that._trigger('shown');
        });
      }
      if ( that.options.closable ) {
        $modal.modal('show');
      } else {
        $modal.modal({
          show: true,
          backdrop: 'static',
          keyboard: false
        });
      }
    }
  });
})(jQuery);
