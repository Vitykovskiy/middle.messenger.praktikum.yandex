import modal from '@/services/modal';
import { Button, Card } from '@/ui';
import { BaseInput } from '@/ui/input/baseInput';
import { isFilesExists } from '@/ui/input/baseInput/helpers';
import { UIText } from '@/ui';

export class FileUploadModal {
  private _card: Card;
  private _header: UIText;
  private _file: File | null = null;

  constructor(loadCallback: (data: FormData) => Promise<void>, fileKey = 'file') {
    this._header = new UIText({
      value: this._defaultHeader,
      wrapperProps: { classes: ['file-upload-card__header'] }
    });

    const uploadBtn = new Button({
      variant: 'text',
      label: this._defaultUploadLabel,
      underline: true,
      wrapperProps: { styles: ['margin: 50px auto 0', 'width: 130px'] }
    });

    const fileInput = new BaseInput({
      type: 'file',
      wrapperProps: {
        id: 'avatarInput',
        accept: 'image/*',
        styles: ['display: none']
      }
    });

    const footer = new Button({
      variant: 'filled',
      label: 'Подтвердить',
      wrapperProps: { styles: ['width: 100%'] }
    });

    uploadBtn.click = () => {
      fileInput.getContent().click();
    };

    fileInput.onChangeFiles = (files) => {
      if (!isFilesExists(files)) {
        this._file = null;
        uploadBtn.setProps({ label: this._defaultUploadLabel });
        this._header.setProps({
          value: this._defaultHeader,
          wrapperProps: { classes: ['file-upload-card__header'] }
        });
        return;
      }

      this._file = files[0];
      this._header.setProps({
        value: 'Файл загружен',
        wrapperProps: { classes: ['file-upload-card__header'] }
      });
      uploadBtn.setProps({ label: this._file.name });
    };

    footer.click = async () => {
      if (!this._file) {
        this._setError('Нужно выбрать файл');
        return;
      }

      try {
        const data = new FormData();
        data.append(fileKey, this._file);
        await loadCallback(data);
        modal.close();
      } catch (error) {
        this._setError(String(error));
      }
    };

    this._card = new Card({
      header: this._header,
      content: [fileInput, uploadBtn],
      actions: footer,
      wrapperProps: { classes: ['file-upload-card'] }
    });
  }

  public get card(): Card {
    return this._card;
  }

  private get _defaultUploadLabel(): string {
    return 'Выбрать файл на компьютере';
  }

  private get _defaultHeader(): string {
    return 'Загрузите файл';
  }

  private _setError(error: string): void {
    this._header.setProps({
      value: error,
      wrapperProps: { classes: ['file-upload-card__header_error'] }
    });
  }
}
