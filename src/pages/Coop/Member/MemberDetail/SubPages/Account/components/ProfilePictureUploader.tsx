import { Upload, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadFile } from 'antd/lib/upload';
import React, { useEffect, useState } from 'react';

import { uploadPhoto } from '@/pages/Coop/Member/data/services/service';
import { useModel } from 'umi';
import './ProfilePictureUploader.css';

export type ProfilePictureUploaderProp = {
  user_id: number;
};

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProp> = (props) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [profilePhotoUrl, setProfilePhoto] = useState<string | undefined>();
  const { account, refresh } = useModel(
    'Coop.Member.MemberDetail.SubPages.Account.useUserMemberAccount',
  );

  useEffect(() => {
    if (account) {
      if (account.data?.user?.profile_photo?.file?.thumbnail) {
        setProfilePhoto(account.data?.user?.profile_photo?.file?.thumbnail);
      }
    }
  }, [account]);

  useEffect(() => {
    if (profilePhotoUrl) {
      setFileList([
        {
          uid: '-1',
          name: 'file',
          status: 'done',
          url: profilePhotoUrl,
        },
      ]);
    }
  }, [profilePhotoUrl]);

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleProfileUploaded = (response: any) => {
    if (response.success) {
      setProfilePhoto(response.data.file.address);
      refresh();
    }
  };

  const handleRequest = async (value: any) => {
    const data = await uploadPhoto(value);
    handleProfileUploaded(data);
  };

  return (
    <ImgCrop rotationSlider>
      <Upload
        action="/api/web/profile-photo"
        listType="picture-circle"
        className="avatar-uploader"
        fileList={fileList}
        data={{
          user_id: props.user_id,
        }}
        name="image"
        customRequest={handleRequest}
        maxCount={1}
        onChange={handleChange}
      >
        {fileList.length > 0 ? null : '+ Upload'}
      </Upload>
    </ImgCrop>
  );
};

export default ProfilePictureUploader;
